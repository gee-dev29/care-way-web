import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { IonContent, IonSkeletonText } from '@ionic/angular/standalone';
import {
  WalletCard,
  FufilCard,
  MedicalRequestCard,
  AddNewEntryCard,
  CardIdentityType,
  DashboardIdentitiesListCard,
} from '@healbridge/ui';
import { Router } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { AuthService, FacilityTypeService } from '@healbridge/shared';
import { AsyncPipe } from '@angular/common';
import { forkJoin, Observable, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-lab-technician-dashboard',
  standalone: true,
  imports: [
    WalletCard,

    FufilCard,

    IonContent,
    IonSkeletonText,

    MedicalRequestCard,
    AsyncPipe,
    AddNewEntryCard,
    DashboardIdentitiesListCard,
  ],
  templateUrl: './lab-technician-dashboard.html',
  styleUrl: './lab-technician-dashboard.css',
})
export class LabTechnicianDashboard implements OnChanges, OnInit, OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);
  labTechLists: any[] = [];
  labTechLists$: Observable<any>;
  costRequests: any;
  route = '';
  private api = inject(ApiService);
  FacilityType = FacilityType;
  loaded = false;
  private facilityTypeService = inject(FacilityTypeService);
  private destroy$ = new Subject<void>();
  facilityTypeId: any = null;
  orders: any;
  addRecord: any = '';
  facilityTypeInfo: any;
  facilityId: any = null;
  @Input() facilityType: any;
  type = CardIdentityType;
  labTechTotalRecords: number;
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
          this.route = `/dashboard/attach-bb/${this.facilityType}/${this.facilityId}`;
          this.addRecord = `/dashboard/add-lab-technician/${this.facilityType}/${this.facilityId}`;

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
              this.labTechTotalRecords = professionals.length;
              this.labTechLists$ =
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

  addLabTech() {
    this.router.navigateByUrl(
      `/dashboard/add-lab-technician/${this.facilityType}/${this.facilityId}`
    );
  }
  viewLabTech() {
    this.router.navigateByUrl(`/dashboard/bbstaff`);
  }

  viewAll() {
    this.router.navigateByUrl('dashboard/request');
  }
  viewAllOrder() {
    this.router.navigateByUrl('dashboard/orders');
  }

  viewOneOrder(order: any) {
    this.router.navigate([
      'dashboard/order-details',
      order.fulfilmentId,
      this.facilityType,
      this.facilityTypeId,
    ]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
