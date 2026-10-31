import { CommonModule, Location } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  ApiService,
  NonProfessionalUserType,
  OrderStatus,
  ReferralType,
} from '@care-way/api';
import {
  PageBody,
  Tab,
  OrderDetailsCard,
  DesktopButton,
  Modal,
  RiderDetailsCard,
  ConfirmationModalDesktop,
} from '@care-way/ui';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { ReferralItems } from '../referral-items/referral-items';
import { Table, TableModule } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { DocumentStatus } from '@care-way/shared';

@Component({
  selector: 'back-office-order-details',
  imports: [
    CommonModule,
    PageBody,
    Tab,
    OrderDetailsCard,
    DesktopButton,
    Modal,
    RiderDetailsCard,
    ReferralItems,
    TableModule,
    ConfirmationModalDesktop,
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrderDetails implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  api = inject(ApiService);
  toastr = inject(ToastrService);
  location = inject(Location);
  orderId: string;
  riderModal: boolean;
  confirmationModal: boolean;
  orderDetails$: Observable<any>;
  riderDetails$: Observable<any>;
  riders$: Observable<any>;
  activeTab = 0;
  selected: any;
  selectedItems: any[] = [];
  filters: object;
  totalRecords: number;
  orderItemsTotalRecords = 0;
  DocumentStatus = DocumentStatus;
  referralType: ReferralType;
  orderItems: object[];
  tabs = [{ title: 'Details', value: 0, content: 'Details' }];
  showAssignRider = ReferralType;
  memberName: string;

  constructor() {
    this.selected = new Map();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.orderId = params.orderId;
      this.getOrderDetails(params.orderId);
    });
  }

  getOrderDetails(orderId: any) {
    this.orderDetails$ = this.api
      .getServiceRequestOrder({ orderId: orderId })
      .pipe(
        tap((orderRequest: any) => {
          this.orderItems = orderRequest?.items ?? [];
          this.orderItemsTotalRecords = this.orderItems.length;
          this.referralType = orderRequest?.referralType;

          if (orderRequest?.memberId) {
            this.getMember({ memberId: orderRequest.memberId });
          }

          if (orderRequest?.riderId) {
            this.getRider(orderRequest.riderId);
          }
        }),
        shareReplay(1)
      );
  }
  getMember(memberId: any) {
    this.api.getMember(memberId).subscribe((member: any) => {
      this.memberName = `${member.firstName} ${member.lastName}`;
    });
  }

  load(event: any) {
    this.filters = {
      ...this.filters,
      userType: NonProfessionalUserType.Rider,
      skip: event.first,
      limit: event.rows,
      firstName: event.filters.firstName?.value || undefined,
      lastName: event.filters.lastName?.value || undefined,
      email: event.filters.email?.value || undefined,
      phone: event.filters.phone?.value || undefined,
    };
    this.getAllRiders();
  }

  getAllRiders() {
    this.riders$ = this.api.getAllUsers(this.filters).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map((response) => response.data)
    );
  }

  getRider(userId: string) {
    this.riderDetails$ = this.api.getUser({ userId });
  }

  assignRiderModal() {
    this.riderModal = true;
    this.selected.clear();
    this.getAllRiders();
  }

  onRowSelect(event: any) {
    this.selected.set(event.data.userId, event.data.userId);
  }

  onRowUnselect(event: any) {
    this.selected.delete(event.data.userId, event.data.userId);
  }

  proceed() {
    if (this.selected.size !== 1) return;
    this.confirmationModal = true;
  }

  selectRider() {
    const riderId: string = [...this.selected.values()][0];

    this.api
      .assignRiderToOrder({ riderId, orderId: this.orderId })
      .subscribe(() => {
        this.toastr.success('Rider Assigned Successfully');
        this.confirmationModal = false;
        this.riderModal = false;
        this.getRider(riderId);
        this.getOrderDetails(this.orderId);
      });
  }

  back() {
    this.location.back();
  }
}
