import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import moment from 'moment';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { InputDropDownComponent } from '@care-way/ui';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ConversionService, Status } from '@care-way/shared';
import {
  ApiService,
  InflowCategory,
  OrderType,
  WithdrawalStatus,
} from '@care-way/api';

@Component({
  selector: 'back-office-wallet',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    DatePickerModule,
    InputDropDownComponent,
  ],
  templateUrl: './wallet.html',
  styleUrl: './wallet.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Wallet implements OnInit {
  conversion = inject(ConversionService);
  api = inject(ApiService);
  @Input() beneficiaryId: string;
  transactionInflows$: Observable<any>;
  transactionOutflows$: Observable<any>;
  inflowTotalRecords = 0;
  outflowTotalRecords = 0;
  orderTypes: { key: string; value: string }[] = [];
  statuses: { key: string; value: string }[] = [];
  orderTypeFilter = new BehaviorSubject<any>('');
  statusFilter = new BehaviorSubject<any>('');
  dateFilter = new BehaviorSubject<any>('');
  moment = moment;
  filters: object;

  ngOnInit() {
    this.conversion.convert(OrderType, this.orderTypes);
    this.conversion.convert(WithdrawalStatus, this.statuses);
  }

  filterByOrderType(event: any) {
    this.orderTypeFilter.next(event);
  }
  filterByStatus(event: any) {
    this.statusFilter.next(event);
  }

  filterByDate(event: any, dateFilterType: any) {
    this.dateFilter.next({
      date: event ? this.moment(event).format('YYYY-MM-DD') : undefined,
      dateFilterType,
    });
  }

  load(event: any) {
    this.filters = {
      ...this.filters,
      skip: event.first,
      limit: event.rows,
    };
    this.dateFilter.subscribe((date: any) => {
      this.filters = {
        ...this.filters,
        date: date || undefined,
      };

      if (date.dateFilterType === 'outflow') {
        this.getTransactionOutflows();
      }
    });
    this.orderTypeFilter.subscribe((orderType: any) => {
      this.filters = {
        ...this.filters,
        orderType: orderType?.value || undefined,
      };
      this.getTransactionInflows();
    });
    this.statusFilter.subscribe((status: any) => {
      this.filters = {
        ...this.filters,
        status: status?.value || undefined,
      };
      this.getTransactionOutflows();
    });
  }

  getTransactionInflows() {
    const beneficiaryId = this.beneficiaryId as any;

    this.transactionInflows$ = this.api
      .getInflows({
        inflowCategory: InflowCategory.GenericInflow,
        ...this.filters,
        beneficiaryId: beneficiaryId,
      })
      .pipe(
        tap((response: any) => {
          this.inflowTotalRecords = response.totalRecords;
        }),
        map((response: any) => response.data)
      );
  }
  getTransactionOutflows() {
    const beneficiaryId = this.beneficiaryId as any;
    this.transactionOutflows$ = this.api
      .getWalletWithdrawals({
        ...this.filters,
        beneficiaryId: beneficiaryId,
      })
      .pipe(
        tap((response: any) => {
          this.outflowTotalRecords = response.totalRecords;
        }),
        map((response: any) => response.data)
      );
  }
}
