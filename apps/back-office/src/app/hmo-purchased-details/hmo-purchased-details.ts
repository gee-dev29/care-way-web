import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { LimitSize, PageBody, Tab } from '@healbridge/ui';
import { HmoPurchasedOrderDetailsCard } from '../hmo-purchased-order-details-card/hmo-purchased-order-details-card';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ApiService } from '@healbridge/api';
import { ActivatedRoute, Params, Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'back-office-hmo-purchased-details',
  imports: [CommonModule, PageBody, HmoPurchasedOrderDetailsCard, Tab],
  templateUrl: './hmo-purchased-details.html',
  styleUrl: './hmo-purchased-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HmoPurchasedDetails implements OnInit {
  api = inject(ApiService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  orderId: string;
  endDate: string;
  hmoProductOrderDetails$: Observable<any>;

  activeTab = 0;
  tabs = [{ title: 'Details', value: 0, content: 'Details' }];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.orderId = params.orderId;
      if (this.orderId) {
        this.getHmoPurchasedDetails(this.orderId);
      }
    });
  }

  getHmoPurchasedDetails(orderId: any) {
    this.hmoProductOrderDetails$ = this.api
      .getHmoProductOrder({ orderId: orderId })
      .pipe(
        tap((response: any) => {
          this.endDate = moment(response.startDate)
            .add(response.durationInMonths, 'months')
            .format('YYYY-MM-DD');
        }),
        switchMap((order: any) =>
          forkJoin({
            products: this.api
              .getHmoProducts({
                hmoId: order.hmoId,
                skip: 0,
                limit: LimitSize.DropDown,
              }),
            user: this.api
              .getUser({ userId: order.userId })
              .pipe(catchError(() => of(null))),
          }).pipe(
            map(({ products, user }: any) => {
              const product = (products?.data ?? []).find(
                (p: any) => p.hmoProductId === order.productId
              );
              return {
                ...order,
                productName: product?.productName?.trim() ?? order.productId,
                userName: user
                  ? `${user.firstName} ${user.lastName}`
                  : order.creator?.name ?? order.userId,
                  inclusions: product?.inclusions,
                  exclusions: product?.exclusions
              };
            })
          )
        )
      );
  }

  back() {
    this.router.navigate(['all-hmo-purchased-list']);
  }
}
