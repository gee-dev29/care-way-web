import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, InflowCategory, OrderType } from '@healbridge/api';
import {
  PageBody,
  Tab,
  RiderDetailsCard,
  PageHighlight,
  UploadCard,
  PaymentTypes,
} from '@healbridge/ui';
import { BehaviorSubject, forkJoin, map, Observable, tap } from 'rxjs';
import { OrderTable } from '../order-table/order-table';
import { LicenseDetailsCard } from '../license-details-card/license-details-card';
import { BankDetailsCard } from '../bank-details-card/bank-details-card';
import { Wallet } from '../wallet/wallet';
import { ConversionService } from '@healbridge/shared';
import moment from 'moment';

@Component({
  selector: 'back-office-rider-details',
  imports: [
    CommonModule,
    PageBody,
    Tab,
    RiderDetailsCard,
    OrderTable,
    PageHighlight,
    LicenseDetailsCard,
    BankDetailsCard,
    Wallet,
    UploadCard,
  ],
  templateUrl: './rider-details.html',
  styleUrl: './rider-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RiderDetails implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  conversion = inject(ConversionService);
  router = inject(Router);
  api = inject(ApiService);
  riderDetails$: Observable<any>;
  license$: Observable<any>;
  bankDetails$: Observable<any>;
  uploads$: Observable<any>;
  activeTab = 0;
  totalRecords = 0;
  riderId: string;
  riderName: string;
  riderPhone: string;
  filters: object;
  moment = moment;
  tabs = [
    { title: 'Details', value: 0, content: 'Details' },
    { title: 'Orders', value: 1, content: 'Orders' },
    { title: 'Uploads', value: 2, content: 'Uploads' },
    { title: 'Wallet Transactions', value: 3, content: 'Wallet Transactions' },
  ];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.riderId = params.riderId;
      this.getRider(this.riderId);
      this.getUploads(this.riderId);
      this.getLicense();
      this.getBankDetails();
    });
  }

  

  getUploads(riderId: string) {
    this.uploads$ = this.api.getUploads({ referencedDocumentId: riderId });
  }

  getRider(riderId: string) {
    this.riderDetails$ = this.api.getUser({ userId: riderId }).pipe(
      tap((rider: any) => {
        this.riderName = `${rider.firstName} ${rider.lastName}`;
        this.riderPhone = rider.phone;
      })
    );
  }



  getBankDetails() {
    this.bankDetails$ = this.api
      .getBankAccount({
        referencedDocumentId: this.riderId,
      })
      .pipe(map((res: any[]) => res[0]));
  }

  getLicense() {
    this.license$ = this.api
      .getPracticeLicenses({
        referencedDocumentId: this.riderId,
      })
      .pipe(map((res: any[]) => res[0]));
  }

  back() {
    this.router.navigate(['list-all-riders']);
  }
}
