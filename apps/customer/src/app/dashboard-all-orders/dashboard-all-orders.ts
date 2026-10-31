import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { DocumentStatus } from '@healbridge/shared';
import { OrderCard, StorageService } from '@healbridge/ui';
import {
  InfiniteScrollCustomEvent,
  IonChip,
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, chevronBackOutline, flash } from 'ionicons/icons';
import { map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard-all-orders',
  imports: [
    IonContent,
    IonSearchbar,
    CommonModule,
    IonChip,
    IonIcon,
    OrderCard,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  templateUrl: './dashboard-all-orders.html',
  styleUrl: './dashboard-all-orders.css',
})
export class DashboardAllOrders implements OnDestroy {
  private router = inject(Router);
  private api = inject(ApiService);
  statuses: string[] = [
    'All',
    'Pending',
    'Processed',
    'Cancelled',
    'Accepted',
    'Payment Initiated',
    'Payment Processing',
    'Payment Completed',
    'Payment Failed',
    'Fulfilment Created',
    'Delivered',
  ];
  statusColors: { [key: string]: string } = {
    Pending: '#F4C430',
    Paid: '#007BFF',
    Delivered: '#28A745',
    Cancelled: '#DC3545',
  };
  private storageService = inject(StorageService);
  private destroy$ = new Subject<void>();
  statusImages: any = {
    Pending: 'logo/pending-icon.svg',
    Paid: '/icons/paid-icon-black.svg',
    Delivered: '/icons/delivered-icon-black.svg',
    Cancelled: '/icons/cancel-icon-black.svg',
  };
  orders$: Observable<any>;
  skip = 0;
  limit = 20;
  orders: any[] = [];
  allData: any[] = [];
  selectedItem: any = DocumentStatus.All;
  memberId: string;
  hasMore = true;
  totalRecords = 0;
  allOrders: any;
  constructor() {
    addIcons({
      chevronBackOutline,
      arrowForwardOutline,
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ionViewWillEnter() {
    this.storageService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: any) => {
        this.memberId = user;
        this.getAllOrders();
      });
  }

  getAllOrders() {
    this.skip = 0;
    this.allOrders = [];
    this.hasMore = true;
    this.fetchOrders();
  }

  selectStatus(status: string) {
    this.selectedItem = status;
    this.skip = 0;
    this.allOrders = [];
    this.allData = [];
    this.fetchOrders();
  }

  loadMore(event?: InfiniteScrollCustomEvent) {
    this.skip += this.limit;
    this.fetchOrders(event);
  }
  private fetchOrders(infiniteEvent?: InfiniteScrollCustomEvent) {
    const params: any = {
      memberId: this.memberId,
      skip: this.skip,
      limit: this.limit,
    };

    if (this.selectedItem && this.selectedItem !== 'All') {
      params.status = this.selectedItem;
    }

    this.orders$ = this.api.getServiceRequestOrders(params).pipe(
      takeUntil(this.destroy$),
      map((response: any) => {
        this.totalRecords = response.totalRecords;
        this.allData = response.data ?? [];
        return response.data ?? [];
      })
    );
    this.orders$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.allOrders = this.skip === 0 ? data : [...this.allOrders, ...data];
      this.hasMore = this.allOrders.length < this.totalRecords;
      infiniteEvent?.target.complete();
    });
  }

  route(order: any) {
    if (order?.status === 'Fulfilment Created') {
      this.router.navigate([
        '/dashboard/order-details',
        order?.serviceRequestOrderId,
        'delivered',
      ]);
    } else {
      this.router.navigate([
        '/dashboard/order-details',
        order?.serviceRequestOrderId,
      ]);
    }
  }

  search(text: any) {
    const inputElement = text.target as HTMLInputElement;
    this.filterList(inputElement.value);
  }

  searchbarInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filterList(inputElement.value);
  }

  filterList(searchQuery: any) {
    if (searchQuery === undefined || searchQuery.trim() === '') {
      this.allOrders = [...this.allData];
    } else {
      const normalizedQuery = searchQuery.toString();
      this.allOrders = this.allData.filter((item: any) =>
        item.orderCode.toString().includes(normalizedQuery)
      );
    }
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }
}
