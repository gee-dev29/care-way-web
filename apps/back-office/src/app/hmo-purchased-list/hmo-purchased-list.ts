import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ApiService,
  NonProfessionalUserType,
  OrderStatus,
} from '@healbridge/api';
import { ConversionService, Export } from '@healbridge/shared';
import {
  PageBody,
  DesktopButton,
  InputDropDownComponent,
  LimitSize,
} from '@healbridge/ui';
import { TableModule } from 'primeng/table';
import {
  BehaviorSubject,
  forkJoin,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import moment from 'moment';

@Component({
  selector: 'back-office-hmo-purchased-list',
  imports: [
    CommonModule,
    PageBody,
    DesktopButton,
    TableModule,
    DatePickerModule,
    InputDropDownComponent,
  ],
  templateUrl: './hmo-purchased-list.html',
  styleUrl: './hmo-purchased-list.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HmoPurchasedList implements OnInit {
  api = inject(ApiService);
  router = inject(Router);
  exportService = inject(Export);
  conversionService = inject(ConversionService);

  hmoPurchased$: Observable<any>;
  users$: Observable<any>;
  hmoProduct$: Observable<any[]>;

  userMap = new Map();
  productMap = new Map();

  orderStatus: { key: string; value: string }[] = [];

  orderStatusFilter = new BehaviorSubject<any>('');
  userFilter = new BehaviorSubject<any>('');
  hmoProductFilter = new BehaviorSubject<any>('');

  totalRecords = 0;
  filters: object;
  hmoId: string;

  ngOnInit(): void {
    this.conversionService.convert(OrderStatus, this.orderStatus);
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
        ),
        tap((users: any[]) => {
          users.forEach((user) => this.userMap.set(user.userId, user.name));
        })
      );

    this.hmoProduct$ = this.api
      .getHmOs({ skip: 0, limit: LimitSize.DropDown })
      .pipe(
        switchMap((hmoResponse: any) => {
          const hmos = hmoResponse.data ?? [];
          if (!hmos.length) return of([]);

          return forkJoin(
            hmos.map((hmo: any) =>
              this.api.getHmoProducts({
                hmoId: hmo.hmoId,
                skip: 0,
                limit: LimitSize.DropDown,
              })
            )
          );
        }),
        map((responses: any) =>
          responses
            .flatMap((response: any) => response?.data ?? [])
            .map((product: any) => ({
              ...product,
              name: product.productName.trim(),
            }))
        ),
        tap((products: any[]) => {
          products.forEach((product) =>
            this.productMap.set(product.hmoProductId, product.productName)
          );
        }),
        shareReplay(1)
      );
  }

  filterByOrderStatus(event: any) {
    this.orderStatusFilter.next(event);
  }

  filterByUser(event: any) {
    this.userFilter.next(event?.value || '');
  }

  filterByHmoProduct(event: any) {
    this.hmoProductFilter.next(event?.value || '');
  }

  load(event: any) {
    this.filters = {
      skip: event.first,
      limit: event.rows,
    };
    this.userFilter.subscribe((user) => {
      this.filters = {
        ...this.filters,
        userId: user || undefined,
      };
      this.getPurchasedProduct(this.filters);
    });
    this.hmoProductFilter.subscribe((hmoProduct) => {
      this.filters = {
        ...this.filters,
        productId: hmoProduct || undefined,
      };
      this.getPurchasedProduct(this.filters);
    });
    this.orderStatusFilter.subscribe((orderStatus: any) => {
      this.filters = {
        ...this.filters,
        status: orderStatus?.value || undefined,
      };
      this.getPurchasedProduct(this.filters);
    });
    this.getPurchasedProduct(this.filters);
  }

  getUserName(userId: string) {
    return this.userMap.get(userId) ?? userId;
  }

  getHmoProduct(productId: string) {
    return this.productMap.get(productId) ?? productId;
  }

  getEndDate(startDate: string, durationInMonths: number) {
    if (!startDate || !durationInMonths) return '';
    return moment(startDate)
      .add(durationInMonths, 'months')
      .format('MMM DD, YYYY');
  }

  getPurchasedProduct(filters: any) {
    this.hmoPurchased$ = this.api.getHmoProductOrders({ ...filters }).pipe(
      tap((response: any) => {
        this.totalRecords = response.totalRecords;
      }),
      map(({ data }) => data)
    );
  }

  view(event: any) {
    this.router.navigate(['hmo-purchased-details', event.orderId]);
  }

  export() {
    this.api
      .getHmoProductOrders({ ...this.filters, limit: this.totalRecords } as any)
      .subscribe((response: any) => {
        this.exportService.exportExcel(response.data, 'HMO Purchased List');
      });
  }
}
