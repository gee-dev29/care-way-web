import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, FacilityType } from '@care-way/api';
import {
  AuthService,
  DocumentStatus,
  FacilityTypeService,
} from '@care-way/shared';
import {
  IonContent,
  IonChip,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, cubeOutline } from 'ionicons/icons';
import { map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { FufilCard } from '@care-way/ui';

@Component({
  selector: 'medical-facility-view-all-recent-orders',
  imports: [
    IonContent,
    CommonModule,
    IonChip,
    IonIcon,
    FufilCard,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  templateUrl: './view-all-recent-orders.html',
  styleUrl: './view-all-recent-orders.css',
})
export class ViewAllRecentOrders implements OnInit {
  private router = inject(Router);
  selectedItem = 'All';
  facilityType: any;
  FacilityType = FacilityType;
  facilityTypeId: string;
  facilityId: any;
  private api = inject(ApiService);
  private destroy$ = new Subject<void>();
  facilityTypeService = inject(FacilityTypeService);
  statuses: string[] = ['All', 'Pending', 'Processed', 'Dispatched'];
  recentOrders = [];
  auth = inject(AuthService);
  recentOrders$: Observable<any>;
  allOrders: any;
  skip = 0;
  limit = 20;
  totalRecords = 0;
  hasMore = true;
  constructor() {
    addIcons({
      chevronBackOutline,
      'cube-outline': cubeOutline,
    });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

  loadMore(event?: InfiniteScrollCustomEvent) {
    this.skip += this.limit;
    this.filteredOrders(event);
  }

  filteredOrders(infiniteEvent?: InfiniteScrollCustomEvent) {
    if (this.selectedItem == 'All') {
      this.recentOrders$ = this.api
        .getFulfilmentOrders({
          skip: this.skip,
          limit: this.limit,
          facilityTypeId: this.facilityTypeId,
          status:
            this.selectedItem === 'All' ? null : (this.selectedItem as any),
        } as any)
        .pipe(
          map((response: any) => {
            this.totalRecords = response.totalRecords;
            return response.data || [];
          })
        );
    } else {
      this.recentOrders$ = this.api
        .getFulfilmentOrders({
          facilityTypeId: this.facilityTypeId,
          status: this.selectedItem,
        })
        .pipe(
          map((response: any) => {
            this.totalRecords = response.totalRecords;
            return response.data || [];
          })
        );
    }
    this.recentOrders$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.allOrders = this.skip === 0 ? data : [...this.allOrders, ...data];
      this.hasMore = this.allOrders.length < this.totalRecords;
      infiniteEvent?.target.complete();
    });
  }

  route() {
    //
  }

  reuse(facilityType: any, facilityId: any) {
    this.facilityId = facilityId;
    this.api
      .getFacilityTypesOfFacility({ facilityId: this.facilityId })
      .subscribe((res: any) => {
        const facility = res.find((f: any) => f.facilityType === facilityType);
        if (!facility) return null;
        switch (facilityType) {
          case this.FacilityType.BloodBank:
          case this.FacilityType.Radiology:
          case this.FacilityType.Laboratory:
          case this.FacilityType.Pharmacy:
            this.facilityTypeId = JSON.parse(
              localStorage.getItem('facilityTypeId') as any
            );
            break;
        }
        this.filteredOrders();
        return facility;
      });
  }

  viewOneOrder(order: any) {
    switch (this.facilityType) {
      case FacilityType.Pharmacy:
      case FacilityType.BloodBank:
        this.router.navigate([
          'dashboard/order-details',
          order.fulfilmentId,
          this.facilityType,
          this.facilityTypeId,
        ]);
        break;

      default:
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
        break;
    }
  }

  ngOnInit() {
    this.auth.userDetail(this.api, (auth) => {
      this.facilityId = auth?.userTypeId;
    });
  }

  ionViewWillEnter() {
    this.destroy$ = new Subject<void>();
    this.auth.userDetail(this.api, (auth) => {
      this.facilityId = auth?.userTypeId;
      this.loadData();
    });
  }

  loadData() {
    this.facilityTypeService.facilityType$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((type) => {
          this.facilityType = type;
          this.selectedItem = 'All';
          return this.api.getFacilityTypesOfFacility({
            facilityId: this.facilityId,
          });
        }),
        map((res: any) => {
          const facility = res.find(
            (f: any) => f.facilityType === this.facilityType
          );
          if (facility) {
            this.setFacilityTypeId(facility);
          }
          return facility;
        }),
        switchMap((facility) => {
          if (!facility) return of(null);
          return this.getOrdersObservable();
        })
      )
      .subscribe((response: any) => {
        if (response) {
          this.totalRecords = response.totalRecords;
          this.allOrders =
            this.skip === 0
              ? response.data
              : [...this.allOrders, ...response.data];
          this.hasMore = this.allOrders.length < this.totalRecords;
        }
      });
  }

  private setFacilityTypeId(facility: any) {
    this.facilityTypeId = JSON.parse(
      localStorage.getItem('facilityTypeId') as any
    );
  }

  private getOrdersObservable() {
    const params: any = {
      skip: this.skip,
      limit: this.limit,
      facilityTypeId: this.facilityTypeId,
    };
    if (this.selectedItem !== 'All') {
      params.status = this.selectedItem;
    }
    return this.api.getFulfilmentOrders(params);
  }

  selectStatus(status: string) {
    this.selectedItem = status;
    this.skip = 0;
    this.allOrders = [];
    this.filteredOrders();
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
