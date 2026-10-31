import { AsyncPipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
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
  AddNewEntryCard,
  CardIdentityType,
  DashboardIdentitiesListCard,
  FufilCard,
  MedicalRequestCard,
  WalletCard,
} from '@care-way/ui';
import { IonSkeletonText } from '@ionic/angular/standalone';
import { forkJoin, Observable, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-pharmacy-dashboard',
  imports: [
    AddNewEntryCard,
    FufilCard,
    IonSkeletonText,
    WalletCard,
    MedicalRequestCard,
    DashboardIdentitiesListCard,
    AsyncPipe,
  ],
  templateUrl: './pharmacy-dashboard.html',
  styleUrl: './pharmacy-dashboard.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PharmacyDashboard implements OnChanges, OnInit, OnDestroy {
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  @Input() facilityType: any;
  FacilityType = FacilityType;
  loaded = false;
  facilityTypeId: any;
  pharmacist$: Observable<any>;
  requests: any;
  private facilityTypeService = inject(FacilityTypeService);
  private destroy$ = new Subject<void>();
  orders: any;
  route: any;
  facilityTypeInfo: any;
  addRecord: any;
  facilityId: any;
  pharmacistTotalRecords: number;
  type = CardIdentityType;
  getAuth: any;
  balance: number | undefined = 0;

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
          this.route = `/dashboard/pharmacy-cost-request-details/${this.facilityType}/${this.facilityId}`;
          this.addRecord = `dashboard/add-pharmacist/${this.facilityType}/${this.facilityId}`;

          forkJoin({
            facilityTypeInfo: this.api.getFacilityTypeById({
              facilityId: this.facilityId,
              facilityType: this.facilityType,
              facilityTypeId: facilityTypeId,
            }),
            professionals: this.api.getProfessionalsInFacilityType({
              facilityTypeId: this.facilityTypeId,
            }),
            requests: this.api.getFacilityTypeServiceRequests({
              facilityTypeId: this.facilityTypeId,
              status: DocumentStatus.Pending,
            }),
            orders: this.api.getFulfilmentOrders({
              facilityTypeId: this.facilityTypeId,
            }),
          }).subscribe({
            next: ({ facilityTypeInfo, professionals, requests, orders }: any) => {
              this.facilityTypeInfo = facilityTypeInfo;
              this.pharmacistTotalRecords = professionals.length;
              this.pharmacist$ =
                professionals.length > 3
                  ? of(professionals.slice(0, 3))
                  : of(professionals);
              if (requests.length > 0) {
                this.requests = requests;
              }
              if (orders.data.length > 0) {
                this.orders = orders.data;
              }
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
  addPharm() {
    this.router.navigate([
      '/dashboard/add-pharmacist',
      this.facilityType,
      this.facilityId,
    ]);
    // this.router.navigateByUrl(`add-pharmacist/${this.facilityId}`);
  }
  allPharm() {
    this.router.navigateByUrl(`/dashboard/pharms`);
  }
  viewAll() {
    this.router.navigateByUrl('dashboard/request');
  }
  viewPharmacist() {
    this.router.navigate(['/dashboard/pharms']);
  }
  viewAllOrder() {
    this.router.navigateByUrl('dashboard/orders');
  }
  viewOneOrder(order: any) {
    this.router.navigate([
      'dashboard/order-details',
      order?.fulfilmentId,
      this.facilityType,
      this.facilityTypeId,
    ]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
