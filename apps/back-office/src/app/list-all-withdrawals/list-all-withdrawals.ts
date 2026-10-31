import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { PageBody } from '@healbridge/ui';
import { WithdrawalTable } from '../withdrawal-table/withdrawal-table';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { ApiService, WithdrawalStatus } from '@healbridge/api';
import { Router } from '@angular/router';
import { ConversionService } from '@healbridge/shared';
import moment from 'moment';

@Component({
  selector: 'back-office-list-all-withdrawals',
  imports: [PageBody, WithdrawalTable],
  templateUrl: './list-all-withdrawals.html',
  styleUrl: './list-all-withdrawals.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListAllWithdrawals implements OnInit {
  api = inject(ApiService);
  conversion = inject(ConversionService);
  router = inject(Router);
  totalRecords = 0;
  withdrawals$: Observable<any>;
  withdrawalStatuses: { key: string; value: string }[] = [];
  filterWithdrawalStatus = new BehaviorSubject<any>('');
  dateFilter = new BehaviorSubject<any>('');
  filters: object;
  moment = moment;

  ngOnInit(): void {
    this.conversion.convert(WithdrawalStatus, this.withdrawalStatuses);
  }

  filterByWithdrawalStatus(event: any) {
    this.filterWithdrawalStatus.next(event);
  }

  filterByDate(event: any) {
    this.dateFilter.next(
      event ? this.moment(event).format('YYYY-MM-DD') : undefined
    );
  }

  load(event: any) {
    this.filters = {
      ...this.filters,
      skip: event.first,
      limit: event.rows,
      status: event.filters.status?.value || undefined,
    };
    this.filterWithdrawalStatus.subscribe((status: any) => {
      this.filters = {
        ...this.filters,
        status: status?.value || undefined,
      };
      this.getAllWithdrawals();
    });
    this.dateFilter.subscribe((date: any) => {
      this.filters = {
        ...this.filters,
        date: date || undefined,
      };
      this.getAllWithdrawals();
    });
    this.getAllWithdrawals();
  }
  getAllWithdrawals() {
    this.withdrawals$ = this.api.getWalletWithdrawals({ ...this.filters }).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map((response: any) => response.data)
    );
  }
  view(item: any) {
    this.router.navigate(['withdrawal-details', item.withdrawalId]);
  }
}
