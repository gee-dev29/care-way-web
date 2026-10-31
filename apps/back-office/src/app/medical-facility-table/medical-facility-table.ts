/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable @angular-eslint/no-output-native */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  ApiService,
  FacilityType,
  ServiceRequestStatus,
} from '@healbridge/api';
import { Export } from '@healbridge/shared';
import { DesktopButton, PageBody, InputDropDownComponent } from '@healbridge/ui';
import { Table, TableModule } from 'primeng/table';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'back-office-medical-facility-table',
  imports: [CommonModule, PageBody, DesktopButton, TableModule, InputDropDownComponent],
  templateUrl: './medical-facility-table.html',
  styleUrl: './medical-facility-table.css',
})
export class MedicalFacilityTable {
  @Input() totalRecords: number;
  @Input() tableHeading: string;
  @Input() facilityType: FacilityType;
  @Input() facilities$: Observable<any>;
  type = FacilityType;
  api = inject(ApiService);
  exportService = inject(Export);
  filters: object;
  @Input() isSkeleton: boolean;
  @Input() disabled: boolean;
  @Output() onRowSelect = new EventEmitter();
  @Output() onRowUnselect = new EventEmitter();
  @Output() onHeaderCheckboxToggle = new EventEmitter<{
    $event: any;
    dt1: Table;
    connectedRequests: any[];
  }>();
  @Output() sendRequest = new EventEmitter<Event>();
  @Output() viewDetails = new EventEmitter<Event>();
  @Input() connectedRequests: any[] = [];
  selection: any[] = [];

  load(event: any) {
    this.filters = {
      skip: event.first,
      limit: event.rows,
      name: event.filters?.name?.value || undefined,
    };

    this.facilities$ = this.api
      .getFacilitiesByType({
        facilityType: this.facilityType,
        ...this.filters,
      })
      .pipe(
        tap((response: any) => {
          this.totalRecords = response.totalRecords;
        }),
        map(({ data }) => {
          const realData = data.map((item: any) => ({
            ...item,
            id:
              item.pharmacyId ??
              item.laboratoryId ??
              item.bloodBankId ??
              item.radiologyId,
          }));
          const allData = realData.filter(
            (response: any) => response.address != null
          );
          return allData;
        })
      );
  }

  isDisabled(item: any): boolean {
    return this.connectedRequests?.some(
      (res) =>
        res.status === ServiceRequestStatus.Pending &&
        res.facilityTypeId === item.id
    );
  }

  rowSelectable = (event: any) => {
    const item = event.data;
    const isPending = this.isDisabled(item);
    return !isPending;
  };

  export() {
    this.api
      .getFacilitiesByType({
        ...this.filters,
        limit: this.totalRecords,
        facilityType: this.facilityType,
      })
      .subscribe((facilites: any) => {
        this.exportService.exportExcel(facilites.data, this.facilityType);
      });
  }

  view(item: any) {
    this.viewDetails.emit(item);
  }
}
