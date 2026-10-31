import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, OrderStatus } from '@healbridge/api';
import { ConversionService } from '@healbridge/shared';
import {
  PageBody,
  DesktopInput,
  DesktopButton,
  InputDropDownComponent,
} from '@healbridge/ui';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'back-office-order-table',
  imports: [
    DesktopInput,
    DesktopButton,
    TableModule,
    CommonModule,
    InputDropDownComponent,
  ],
  templateUrl: './order-table.html',
  styleUrl: './order-table.css',
})
export class OrderTable {
  api = inject(ApiService);
  router = inject(Router);
  conversionService = inject(ConversionService);
  orders$: Observable<any>;
  riders$: Observable<any>;
  totalRecords = 0;
  filters: object;
  statuses: { key: string; value: string }[] = [];
  statusFilter = new BehaviorSubject<any>('');
  moment = moment;
  @Input() heading: string;
  @Input() memberId: string;
  @Input() riderId: string;
  @Input() serviceRequestId: string;

  ngOnInit(): void {
    this.conversionService.convert(OrderStatus, this.statuses);
  }

  filterByStatus(event: any) {
    this.statusFilter.next(event);
  }
  filterByOrderNumber(event: any) {
    const orderNumber = event.target?.value;

    if (!orderNumber) {
      this.getAllOrders();
      return;
    }
    if (orderNumber.length === 7) {
      this.getOrderNumber(orderNumber);
    }
  }
  onInputChange(event: any) {
    const value = event.target?.value;
    if (!value) {
      this.getAllOrders();
    }
  }

  getOrderNumber(orderNumber: any) {
    this.orders$ = this.api.getOrderByOrderNumber({ orderNumber }).pipe(
      tap(() => {
        this.totalRecords = 1;
      }),
      map((response: any) => [response])
    );
  }

  load(event: any) {
    this.filters = {
      ...this.filters,
      skip: event.first,
      limit: event.rows,
    };
    this.statusFilter.subscribe((status) => {
      this.filters = {
        ...this.filters,
        status: status?.value,
      };
      this.getAllOrders();
    });
    this.getAllOrders();
  }

  getAllOrders() {
    this.orders$ = this.api
      .getServiceRequestOrders({
        ...this.filters,
        memberId: this.memberId,
        riderId: this.riderId,
        serviceRequestId: this.serviceRequestId,
      })
      .pipe(
        tap((response: any) => {
          this.totalRecords = response.totalRecords;
        }),
        map((response: any) => response.data)
      );
  }
  view(event: any) {
    this.router.navigate(['order-details', event.serviceRequestOrderId]);
  }
}
