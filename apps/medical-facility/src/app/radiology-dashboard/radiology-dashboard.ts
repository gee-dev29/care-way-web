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
import { ApiService, FacilityType } from '@care-way/api';
import {
  AuthService,
  DocumentStatus,
  FacilityTypeService,
} from '@care-way/shared';
import {
  WalletCard,
  DashboardIdentitiesListCard,
  CardIdentityType,
  MedicalRequestCard,
  AddNewEntryCard,
  FufilCard,
} from '@care-way/ui';
import { IonContent, IonSkeletonText } from '@ionic/angular/standalone';
import { forkJoin, Observable, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-radiology-dashboard',
  imports: [
    WalletCard,
    // FufilCard,
    MedicalRequestCard,
    IonContent,
    IonSkeletonText,
    AddNewEntryCard,
    DashboardIdentitiesListCard,
    AsyncPipe,
    FufilCard,
  ],
  templateUrl: './radiology-dashboard.html',
  styleUrl: './radiology-dashboard.css',
})
export class RadiologyDashboard implements OnChanges, OnInit, OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);
  radiologist$: Observable<any>;
  costRequests: any;
  validateFulfilment = false;
  route: string;
  private api = inject(ApiService);
  FacilityType = FacilityType;
  loaded = false;
  facilityTypeId: any;
  facilityTypeInfo: any;
  addRecord: any;
  private facilityTypeService = inject(FacilityTypeService);
  private destroy$ = new Subject<void>();
  orders: any;
  facilityId: any;
  @Input() facilityType: any;
  radiologistTotalRecords: number;
  type = CardIdentityType;
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
          this.route = `/dashboard/attach-radiology/${this.facilityType}/${this.facilityId}`;
          this.addRecord = `/dashboard/add-radiologist/${this.facilityType}/${this.facilityId}`;

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
              this.radiologistTotalRecords = professionals.length;
              this.radiologist$ =
                professionals.length > 3
                  ? of(professionals.slice(0, 3))
                  : of(professionals);
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

  addRadiologist() {
    this.router.navigateByUrl(this.addRecord);
  }
  allPharm() {
    this.router.navigateByUrl(`/dashboard/radiologystaff`);
  }
  viewRadiologist() {
    this.router.navigate(['dashboard/radiologystaff']);
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
