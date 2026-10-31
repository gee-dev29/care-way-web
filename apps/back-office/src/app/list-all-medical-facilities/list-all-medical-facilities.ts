import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopButton, PageBody } from '@healbridge/ui';
import { TableModule } from 'primeng/table';
import { map, Observable, tap } from 'rxjs';
import { ApiService } from '@healbridge/api';
import { Router } from '@angular/router';
import { Export } from '@healbridge/shared';

@Component({
  selector: 'back-office-list-all-medical-facilities',
  imports: [CommonModule, DesktopButton, PageBody, TableModule],
  templateUrl: './list-all-medical-facilities.html',
  styleUrl: './list-all-medical-facilities.css',
})
export class ListAllMedicalFacilities {
  totalRecords: number;
  medicalFacilities$: Observable<any>;
  filters: any;
  api = inject(ApiService);
  exportService = inject(Export);
  private router = inject(Router);

  load(event: any) {
    this.filters = {
      skip: event.first,
      limit: event.rows,
      name: event.filters?.name?.value || undefined,
      email: event.filters?.email?.value || undefined,
      phoneNumber: event.filters?.phoneNumber?.value || undefined
    };

    this.medicalFacilities$ = this.api.getFacilities(this.filters).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map(({ data }) => data)
    );
  }

  view(item: any) {
    this.router.navigate(['medical-facility-details', item.facilityId]);
  }
  onboardFacility() {
    this.router.navigateByUrl('create-medical-facility');
  }

  export() {
    this.api
      .getFacilities({ ...this.filters, limit: this.totalRecords })
      .subscribe((facilities: any) => {
        this.exportService.exportExcel(facilities.data, 'Medical Facilities');
      });
  }
}
