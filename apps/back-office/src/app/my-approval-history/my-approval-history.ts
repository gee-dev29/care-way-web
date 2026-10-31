import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { DesktopButton, PageBody, InputDropDownComponent } from '@care-way/ui';
import { Table, TableModule } from 'primeng/table';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { AuthService, ConversionService, Export } from '@care-way/shared';
import { ApiService, ApprovalType } from '@care-way/api';
import moment from 'moment';
import { Router } from '@angular/router';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'back-office-my-approval-history',
  imports: [CommonModule, DesktopButton, TableModule, PageBody, InputDropDownComponent, DatePicker],
  templateUrl: './my-approval-history.html',
  styleUrl: './my-approval-history.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyApprovalHistory implements OnInit {
  conversion = inject(ConversionService);
  auth = inject(AuthService);
  api = inject(ApiService);
  exportService = inject(Export);
  router = inject(Router);

  approvals$: Observable<any>;

  filters: object;
  userTypeId: string;
  event: any;
  totalRecords = 0;
  selected = new Map();

  approvalTypes: { key: string; value: string }[] = [];

  tableEvent$ = new BehaviorSubject<any>('');
  approvalTypeFilter = new BehaviorSubject<any>('');
  staffFilter = new BehaviorSubject<any>('');
  dateFilter = new BehaviorSubject<any>('');

  ngOnInit(): void {
    this.userTypeId = this.auth.getUserId();
    this.conversion.convert(ApprovalType, this.approvalTypes);
  }

  filterByType(type: any) {
    this.approvalTypeFilter.next(type?.value || '');
  }

  filterByDate(date: any) {
    this.dateFilter.next(date ? moment(date).format('YYYY-MM-DD') : '');
  }

  filterByStaff(type: any) {
    this.staffFilter.next(type?.value || '');
  }

  load(event: any) {
    this.event = event;
    this.tableEvent$.next(event);

    this.filters = {
      ...this.filters,
      skip: event.first,
      limit: event.rows,
      description: event.filters?.description?.value || undefined,
    };
    this.dateFilter.subscribe((date: any) => {
      this.filters = {
        ...this.filters,
        date: date || undefined,
      };
      this.getAllPendingApproval(this.filters);
    });
    this.approvalTypeFilter.subscribe((approvalType: any) => {
      this.filters = {
        ...this.filters,
        approvalType: approvalType || undefined,
      };
      this.getAllPendingApproval(this.filters);
    });
    this.getAllPendingApproval(this.filters);
  }

  getAllPendingApproval(filter: any) {
    this.approvals$ = this.api.getUserApprovalHistory({ ...filter }).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map(({ results }) => results)
    );
  }

  export() {
    this.api
      .getUserApprovalHistory({
        ...this.filters,
        limit: this.totalRecords,
      })
      .subscribe((approvals: any) => {
        this.exportService.exportExcel(approvals.results, 'My Approval History');
      });
  }
}
