import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { PageBody, Tab, PageHighlight, PaymentTypes } from '@healbridge/ui';
import { MedicalFacilityDetailsCard } from '../medical-facility-details-card/medical-facility-details-card';
import { BankDetailsCard } from '../bank-details-card/bank-details-card';
import { Wallet } from '../wallet/wallet';
import { LicenseDetailsCard } from '../license-details-card/license-details-card';
import { BehaviorSubject, forkJoin, map, Observable, tap } from 'rxjs';
import { ApiService, FacilityType, InflowCategory, OrderType } from '@healbridge/api';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConversionService } from '@healbridge/shared';
import { Location } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'back-office-blood-bank-details',
  imports: [
    PageBody,
    Tab,
    PageHighlight,
    MedicalFacilityDetailsCard,
    BankDetailsCard,
    Wallet,
    LicenseDetailsCard,
  ],
  templateUrl: './blood-bank-details.html',
  styleUrl: './blood-bank-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BloodBankDetails implements OnInit {
  router = inject(Router);
  api = inject(ApiService);
  activatedroute = inject(ActivatedRoute);
  conversion = inject(ConversionService);
  location = inject(Location);

  bloodBank$: Observable<any>;
  license$: Observable<any>;
  bankDetails$: Observable<any>;
  activeTab = 0;
  totalRecords = 0;
  facilityName: string;
  address: string;
  facilityId: string;
  facilityTypeId: string;
  filters: object;
  moment = moment;

  tabs = [
    { title: 'Details', value: 0, content: 'Details' },
    { title: 'Wallet Transactions', value: 1, content: 'Wallet Transactions' },
  ];

  ngOnInit() {
    this.activatedroute.params.subscribe((params: Params[string]) => {
      this.facilityId = params.facilityId;
      this.facilityTypeId = params.facilityTypeId;
      this.getBloodBankDetails(this.facilityId, this.facilityTypeId);
      this.getBankDetails();
      this.getLicense();
    });
  }


  getBloodBankDetails(facilityId: string, facilityTypeId: string) {
    this.bloodBank$ = this.api
      .getFacilityTypeById({
        facilityId,
        facilityTypeId,
        facilityType: FacilityType.BloodBank,
      })
      .pipe(
        tap((response: any) => {
          this.facilityName = response.name;
          this.address = `${response.address.address} ${response.address.city}`;
        })
      );
  }

  getBankDetails() {
    this.bankDetails$ = this.api
      .getBankAccount({
        referencedDocumentId: this.facilityTypeId,
      })
      .pipe(map((res: any[]) => res[0]));
  }

  getLicense() {
    this.license$ = this.api
      .getPracticeLicenses({
        referencedDocumentId: this.facilityTypeId,
      })
      .pipe(map((res: any[]) => res[0]));
  }

  goBack() {
    this.location.back();
  }
}
