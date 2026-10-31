import { Component, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, InflowCategory, OrderType } from '@care-way/api';
import {
  FacilityType,
  PageBody,
  Tab,
  PageHighlight,
  PaymentTypes,
} from '@care-way/ui';
import { BehaviorSubject, forkJoin, map, Observable, tap } from 'rxjs';
import { MedicalFacilityDetailsCard } from '../medical-facility-details-card/medical-facility-details-card';
import { BankDetailsCard } from '../bank-details-card/bank-details-card';
import { LicenseDetailsCard } from '../license-details-card/license-details-card';
import { Wallet } from '../wallet/wallet';
import { ConversionService, Status } from '@care-way/shared';
import { Location } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'back-office-laboratory-details',
  imports: [
    PageBody,
    Tab,
    PageHighlight,
    MedicalFacilityDetailsCard,
    BankDetailsCard,
    LicenseDetailsCard,
    Wallet,
  ],
  templateUrl: './laboratory-details.html',
  styleUrl: './laboratory-details.css',
})
export class LaboratoryDetails {
  router = inject(Router);
  api = inject(ApiService);
  activatedroute = inject(ActivatedRoute);
  conversion = inject(ConversionService);
  location = inject(Location);
  laboratory$: Observable<any>;
  license$: Observable<any>;
  bankDetails$: Observable<any>;
  balance$: Observable<any>;
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
      this.getLaboratoryDetails(this.facilityId, this.facilityTypeId);
      this.getBankDetails();
      this.getLicense();
      this.getBalance();
    });
  }


  getLaboratoryDetails(facilityId: string, facilityTypeId: string) {
    this.laboratory$ = this.api
      .getFacilityTypeById({
        facilityId,
        facilityTypeId,
        facilityType: FacilityType.Laboratory,
      })
      .pipe(
        tap((response: any) => {
          this.facilityName = response.name;
          this.address = `${response.address.address} ${response.address.city}`;
        })
      );
  }

  getBalance() {
    this.balance$ = this.api.getWalletSummary();
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
