import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ApiService, NonProfessionalUserType, OrderStatus } from '@care-way/api';
import { ConversionService } from '@care-way/shared';
import {
  PageBody,
  DesktopButton,
  InputDropDownComponent,
  LimitSize,
} from '@care-way/ui';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, map, Observable, skip, tap } from 'rxjs';

@Component({
  selector: 'back-office-msa-order',
  imports: [
    PageBody,
    DesktopButton,
    CommonModule,
    TableModule,
    InputDropDownComponent,
  ],
  templateUrl: './msa-order.html',
  styleUrl: './msa-order.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MsaOrder implements OnInit {
  api = inject(ApiService);
  conversion = inject(ConversionService);

  msaOrder$: Observable<any>;
  users$: Observable<any>;
  totalRecords: number;
  filters: object;
  msaStatusFilter = new BehaviorSubject<any>('');
  userFilter = new BehaviorSubject<any>('');
  msaStatuses: { key: string; value: string }[] = [];

  ngOnInit(): void {
    this.conversion.convert(OrderStatus, this.msaStatuses)

    this.users$ = this.api
      .getAllUsers({
        skip: 0,
        limit: LimitSize.DropDown,
        userType: NonProfessionalUserType.Default as any,
      })
      .pipe(
        map((response: any) =>
          response.data.map((user: any) => ({
            ...user,
            name: `${user.firstName} ${user.lastName}`,
          }))
        )
      )
  }

  filterByStatus(event: any) {
    this.msaStatusFilter.next(event);
  }

  filterByUser(type: any) {
    this.userFilter.next(type?.value || '');
  }

  load(event: any) {
    this.filters = {
      skip: event.rows,
      limit: event.first,
    };
    this.msaStatusFilter.subscribe((status: any) => {
      this.filters = {
        ...this.filters,
        status: status?.value || undefined,
      };
      this.getMsaOrder()
    });
    this.userFilter.subscribe((user: any) => {
      this.filters = {
        ...this.filters,
        userId: user || undefined
      }
      this.getMsaOrder()
    })
    this.getMsaOrder();
  }

  getMsaOrder() {
    this.msaOrder$ = this.api.getMsaOrders({ ...this.filters }).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map(({ data }) => data)
    );
  }
}
