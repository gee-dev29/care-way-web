import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { OrderCard } from '@healbridge/ui';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonImg,
  IonSearchbar,
  IonChip,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'rider-all-order-rider',
  imports: [
    IonContent,
    IonSearchbar,
    CommonModule,
    IonChip,
    OrderCard,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  templateUrl: './all-order-rider.html',
  styleUrl: './all-order-rider.css',
})
export class AllOrderRider implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  statuses: string[] = ['Assigned', 'Shipped', 'Delivered'];
  selectedItem = 'Assigned';

  orders: any[] = [];
  riderId: any;

  searchText = '';
  skip = 0;
  limit = 20;
  hasMore = true;
  totalRecords = 0;

  ngOnInit() {
    this.riderId = this.auth.getUserId();
    this.getAllOrders();
  }

  ionViewWillEnter() {
    this.riderId = this.auth.getUserId();
    this.getAllOrders();
  }

  getAllOrders() {
    this.skip = 0;
    this.orders = [];
    this.hasMore = true;
    this.fetchOrders();
  }

  search(event: any) {
    this.searchText = event?.target?.value || '';

    if (!this.searchText.trim()) {
      this.getAllOrders();
    }
  }

  searchOnEnter(event: any) {
    if (event.key !== 'Enter') return;

    this.skip = 0;
    this.orders = [];
    this.hasMore = true;
    this.fetchOrders();
  }

  private statusMap: Record<string, string[]> = {
    Assigned: ['Fulfilment Created'],
    Shipped: ['Shipped'],
    Delivered: ['Delivered', 'Inflows Generated'],
  };

  private fetchOrders(infiniteEvent?: InfiniteScrollCustomEvent) {
    const statusesToFetch = this.statusMap[this.selectedItem] ?? [
      this.selectedItem,
    ];

    const requests = statusesToFetch.map((status) => {
      const payload: any = {
        riderId: this.riderId,
        status,
        skip: this.skip,
        limit: this.limit,
      };

      if (this.searchText?.trim()) {
        payload.orderNumber = this.searchText.trim();
      }

      return this.api.getServiceRequestOrders(payload);
    });

    forkJoin(requests).subscribe({
      next: (responses: any[]) => {
        const data = responses
          .flatMap((res) => res.data || [])
          .map((order) =>
            order?.status === 'Inflows Generated'
              ? { ...order, status: 'Delivered' }
              : order
          );

        this.totalRecords = responses.reduce(
          (sum, res) => sum + (res.totalRecords || 0),
          0
        );

        this.orders = this.skip === 0 ? data : [...this.orders, ...data];

        this.hasMore = this.orders.length < this.totalRecords;

        infiniteEvent?.target.complete();
      },
      error: () => {
        infiniteEvent?.target.complete();
      },
    });
  }

  loadMore(event?: InfiniteScrollCustomEvent) {
    if (!this.hasMore) {
      event?.target.complete();
      return;
    }

    this.skip += this.limit;
    this.fetchOrders(event);
  }

  selectStatus(status: string) {
    this.selectedItem = status;
    this.skip = 0;
    this.orders = [];
    this.hasMore = true;
    this.fetchOrders();
  }

  route(order: any) {
    this.router.navigate([
      '/dashboard/order-details',
      order?.serviceRequestOrderId,
    ]);
  }
}
