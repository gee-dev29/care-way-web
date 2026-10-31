import { AsyncPipe } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import {
  AuthService,
  DocumentStatus,
  FacilityTypeService,
} from '@healbridge/shared';
import {
  WalletCard,
  FufilCard,
  DashboardIdentitiesListCard,
  CardIdentityType,
  AddNewEntryCard,
  MedicalRequestCard,
} from '@healbridge/ui';
import { IonContent, IonSkeletonText } from '@ionic/angular/standalone';
import { forkJoin, Observable, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-lab-dashboard',
  imports: [
    WalletCard,
    IonContent,
    IonSkeletonText,
    FufilCard,
    DashboardIdentitiesListCard,
    MedicalRequestCard,
    AddNewEntryCard,
    AsyncPipe,
  ],
  templateUrl: './lab-dashboard.html',
  styleUrl: './lab-dashboard.css',
})
export class LabDashboard implements OnChanges, OnInit, OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);
  labTechLists = [];
  costRequests: any;
  route: any;
  private api = inject(ApiService);
  FacilityType = FacilityType;
  loaded = false;
  validateFulfilment = false;
  private facilityTypeService = inject(FacilityTypeService);
  private destroy$ = new Subject<void>();
  facilityTypeId: any;
  addRecord: any;
  facilityId: any;
  orders: any;
  facilityTypeInfo: any;
  @Input() facilityType: any;
  type = CardIdentityType;
  laboratoryStaffTotalRecords: number;
  laboratoryStaff$: Observable<any>;
  getAuth: any;
  balance: number | undefined;

  ngOnInit() {
    this.facilityTypeService.facilityType$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.ngOnChanges();
      });

    this.api.getWalletSummary().subscribe({
      next: (res) => {
        this.balance = res.balance;
      },
    });
  }
  ngOnChanges(): void {
    setTimeout(() => {
      this.auth.userDetail(this.api, (auth) => {
        this.getAuth = auth;
        this.facilityId = auth?.userTypeId;
        const facilityType = JSON.parse(
          localStorage.getItem('facilityType') as any
        );
        const facilityTypeId = JSON.parse(
          localStorage.getItem('facilityTypeId') as any
        );
        this.facilityTypeId = facilityTypeId;
        if (facilityType === this.facilityType && this.facilityTypeId != null) {
          this.addRecord = `/dashboard/add-scientist/${this.facilityType}/${this.facilityId}`;
          this.route = `/dashboard/attachment-labtest-request-details/${this.facilityType}/${this.facilityId}`;
          this.addRecord = `/dashboard/add-pharmacist/${this.facilityType}/${this.facilityId}`;

          forkJoin({
            facilityTypeInfo: this.api.getFacilityTypeById({
              facilityId: this.facilityId,
              facilityType: this.facilityType,
              facilityTypeId: facilityTypeId,
            }),
            professionals: this.api.getProfessionalsInFacilityType({
              facilityTypeId: this.facilityTypeId,
            }),
            costRequests: this.api.getFacilityTypeServiceRequests({
              facilityTypeId: this.facilityTypeId,
            }),
            orders: this.api.getFulfilmentOrders({
              facilityTypeId: this.facilityTypeId,
            }),
          }).subscribe({
            next: ({ facilityTypeInfo, professionals, costRequests, orders }: any) => {
              this.facilityTypeInfo = facilityTypeInfo;
              this.laboratoryStaffTotalRecords = professionals.length;
              this.laboratoryStaff$ = of(
                professionals.length > 3
                  ? professionals.slice(0, 3)
                  : professionals
              );
              this.costRequests = costRequests;
              this.orders = orders.data;
              this.loaded = true;
            },
            error: () => {
              this.loaded = true;
            },
          });
        } else {
          this.loaded = true;
        }
      });
    }, 1000);
  }

  allStaff() {
    this.router.navigateByUrl(`/dashboard/labstaffs`);
  }

  viewAll() {
    this.router.navigateByUrl('dashboard/request');
  }
  viewAllOrder() {
    this.router.navigateByUrl('dashboard/orders');
  }

  viewOneOrder(order: any) {
    if (order.status !== DocumentStatus.Pending) {
      this.router.navigate([
        'dashboard/order-details',
        order.fulfilmentId,
        this.facilityType,
        this.facilityTypeId,
      ]);
    } else {
      this.router.navigate([
        'dashboard/confirm-dispatch-pin',
        order.orderId,
        order.fulfilmentId,
        this.facilityType,
        this.facilityTypeId,
      ]);
    }
  }

  addLaboratoryStaff() {
    this.router.navigateByUrl(
      `/dashboard/add-scientist/${this.facilityType}/${this.facilityId}`
    );
  }

  viewAllLaboratoryStaff() {
    this.router.navigateByUrl('dashboard/labstaffs');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
