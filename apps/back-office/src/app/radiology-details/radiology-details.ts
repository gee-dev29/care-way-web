import { CommonModule, Location } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, FacilityType, InflowCategory, OrderType } from '@care-way/api';
import { PageBody, PageHighlight, PaymentTypes, Tab } from '@care-way/ui';
import {
  BehaviorSubject,
  forkJoin,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { BankDetailsCard } from '../bank-details-card/bank-details-card';
import { Wallet } from '../wallet/wallet';
import { LicenseDetailsCard } from '../license-details-card/license-details-card';
import { MedicalFacilityDetailsCard } from '../medical-facility-details-card/medical-facility-details-card';
import { ConversionService } from '@care-way/shared';
import moment from 'moment';

@Component({
  selector: 'back-office-radiology-details',
  imports: [
    CommonModule,
    PageBody,
    MedicalFacilityDetailsCard,
    PageHighlight,
    Tab,
    BankDetailsCard,
    LicenseDetailsCard,
    Wallet,
  ],
  templateUrl: './radiology-details.html',
  styleUrl: './radiology-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RadiologyDetails {
  router = inject(Router);
  api = inject(ApiService);
  activatedroute = inject(ActivatedRoute);
  conversion = inject(ConversionService);
  location = inject(Location);

  radiology$: Observable<any>;
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
      this.getRadiologyDetails(this.facilityId, this.facilityTypeId);
      this.getBankDetails();
      this.getLicense();
    });
  }


  getRadiologyDetails(facilityId: string, facilityTypeId: string) {
    this.radiology$ = this.api
      .getFacilityTypeById({
        facilityId,
        facilityTypeId,
        facilityType: FacilityType.Radiology,
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
