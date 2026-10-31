import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ApiService,
  NonProfessionalUserType,
  ReferralType,
  ServiceRequestStatus,
} from '@care-way/api';
import { ConversionService, Export } from '@care-way/shared';
import {
  DesktopButton,
  PageBody,
  InputDropDownComponent,
  LimitSize,
} from '@care-way/ui';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'back-office-service-request-table',
  imports: [
    CommonModule,
    TableModule,
    DesktopButton,
    PageBody,
    InputDropDownComponent,
  ],
  templateUrl: './service-request-table.html',
  styleUrl: './service-request-table.css',
})
export class ServiceRequestTable implements OnInit {
  conversion = inject(ConversionService);
  exportService = inject(Export);
  @Input() totalRecords: number;
  @Input() tableHeading: string;
  @Input() heading: string;
  @Input() referralType: ReferralType;
  @Input() serviceRequests$: Observable<any>;
  @Input() connectedServiceRequests$: Observable<any>;
  customers$: Observable<any>;
  customerFilter = new BehaviorSubject<any>('');
  statusFilter = new BehaviorSubject<any>('');
  statuses: { key: string; value: string }[] = [];
  selectedCustomer: string | null = null;
  selectedStatus: string | null = null;
  type = ReferralType;
  api = inject(ApiService);
  router = inject(Router);
  filters: object;
  @Input() isSkeleton: boolean;
  @Input() isChildView: boolean;
  @Input() showAccept: boolean;
  @Input() showFacilityName: boolean;
  @Output() loadConnectedServiceRequests = new EventEmitter();
  status = ServiceRequestStatus;
  @Output() acceptRequest = new EventEmitter();
  @Output() viewCost = new EventEmitter();
  moment = moment;

  ngOnInit(): void {
    this.conversion.convert(ServiceRequestStatus, this.statuses);
    this.getAllCustomers();
    this.getAllServiceRequests(this.filters);
  }

  filterByStatus(event: any) {
    this.statusFilter.next(event);
  }

  filterByCustomer(event: any) {
    this.customerFilter.next(event);
  }

  load(event: any) {
    this.statusFilter.subscribe((status) => {
      this.filters = {
        ...this.filters,
        skip: event.first,
        limit: event.rows,
        status: status?.value,
      };
      this.getAllServiceRequests(this.filters);
    });

    this.customerFilter.subscribe((member) => {
      this.filters = {
        ...this.filters,
        skip: event.first,
        limit: event.rows,
        memberId: member?.value,
      };
      this.getAllServiceRequests(this.filters);
    });
  }

  getAllCustomers() {
    const customerFilters: object = {
      limit: LimitSize.DropDown,
      userType: NonProfessionalUserType.Default,
    };
    this.customers$ = this.api.getMembers(customerFilters).pipe(
      map((response: any) =>
        response.data.map((member: any) => ({
          ...member,
          memberName: `${member.firstName} ${member.lastName}`,
        }))
      )
    );
  }

  getAllServiceRequests(filter: any) {
    this.serviceRequests$ = this.api
      .getServiceRequests({
        referralType: this.referralType,
        ...filter,
      })
      .pipe(
        tap((response: any) => {
          this.totalRecords = response.totalRecords;
        }),
        map(({ data }) => data)
      );
  }

  view(item: any) {
    this.router.navigate([
      'service-request-details',
      'serviceRequestId',
      item.serviceRequestId,
      'memberId',
      item.memberId,
      'referralType',
      this.referralType,
    ]);
  }

  export() {
    this.api
      .getServiceRequests({
        ...this.filters,
        limit: this.totalRecords,
        referralType: this.referralType,
      })
      .subscribe((serviceRequest: any) => {
        this.exportService.exportExcel(serviceRequest.data, this.referralType);
      });
  }
}
