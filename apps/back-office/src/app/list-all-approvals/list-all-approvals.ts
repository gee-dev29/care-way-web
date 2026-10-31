import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import {
  PageBody,
  ButtonComponent,
  DesktopButton,
  InputDropDownComponent,
  ConfirmationModalDesktop,
} from '@care-way/ui';
import { ApprovalTable } from '../approval-table/approval-table';
import { ApiService, ApprovalType } from '@care-way/api';
import { Router } from '@angular/router';
import { ConversionService } from '@care-way/shared';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'back-office-list-all-approvals',
  imports: [
    PageBody,
    DesktopButton,
    ApprovalTable,
    CommonModule,
    InputDropDownComponent,
    TableModule,
    ConfirmationModalDesktop,
  ],
  templateUrl: './list-all-approvals.html',
  styleUrl: './list-all-approvals.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListAllApprovals {
  api = inject(ApiService);
  router = inject(Router);
  toastr = inject(ToastrService);
  conversion = inject(ConversionService);
  approvalRoutes$: Observable<any>;

  approvalTypes: { key: string; value: string }[] = [];
  approvalTypeFilter = new BehaviorSubject<any>('');

  approvalModal = false;
  selectedApprovalRouteId: string;
  totalRecords = 0;
  filters: object;

  ngOnInit(): void {
    this.conversion.convert(ApprovalType, this.approvalTypes);
  }

  filterByApprovalType(event: any) {
    this.approvalTypeFilter.next(event);
  }

  load(event: any) {
    this.filters = {
      skip: event.first,
      limit: event.rows,
    };
    this.approvalTypeFilter.subscribe((approvalType: any) => {
      this.filters = {
        ...this.filters,
        approvalType: approvalType?.value || undefined,
      };
      this.getAllApprovalRoutes();
    });
    this.getAllApprovalRoutes();
  }

  getAllApprovalRoutes() {
    this.approvalRoutes$ = this.api.getApprovalRoutes(this.filters).pipe(
      tap((response: any) => {
        this.totalRecords = response.length;
      }),
      map((response: any[]) => response)
    );
  }

  showDeleteModal(event: any) {
    this.selectedApprovalRouteId = event.approvalRouteId;
    this.approvalModal = true;
  }

  deleteApproval() {
    this.api
      .deleteApprovalRoute({ approvalRouteId: this.selectedApprovalRouteId })
      .subscribe((response: any) => {
        console.log(response)
        this.toastr.success('Approval Route Deleted Successfully');
        this.approvalModal = false;
        this.getAllApprovalRoutes()
      });
  }

  view(item: any) {
    this.router.navigate(['approval-route-details', item.approvalRouteId]);
  }

  addRoute() {
    this.router.navigate(['create-approval-route']);
  }
}
