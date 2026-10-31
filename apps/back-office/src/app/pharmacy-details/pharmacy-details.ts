import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import {
  FacilityType,
  PageBody,
  PageHighlight,
  PaymentTypes,
  Tab,
} from '@healbridge/ui';
import { MedicalFacilityDetailsCard } from '../medical-facility-details-card/medical-facility-details-card';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, InflowCategory, OrderType } from '@healbridge/api';
import { BehaviorSubject, forkJoin, map, Observable, tap } from 'rxjs';
import { BankDetailsCard } from '../bank-details-card/bank-details-card';
import { LicenseDetailsCard } from '../license-details-card/license-details-card';
import { Wallet } from '../wallet/wallet';
import { CommonModule, Location } from '@angular/common';
import { ConversionService } from '@healbridge/shared';
import moment from 'moment';

@Component({
  selector: 'back-office-pharmacy-details',
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
  templateUrl: './pharmacy-details.html',
  styleUrl: './pharmacy-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PharmacyDetails implements OnInit {
  router = inject(Router);
  api = inject(ApiService);
  activatedroute = inject(ActivatedRoute);
  conversion = inject(ConversionService);
  location = inject(Location);

  pharmacy$: Observable<any>;
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
      this.getPharmacyDetails(this.facilityId, this.facilityTypeId);
      this.getBankDetails();
      this.getLicense();
    });
  }



  getPharmacyDetails(facilityId: string, facilityTypeId: string) {
    this.pharmacy$ = this.api
      .getFacilityTypeById({
        facilityId,
        facilityTypeId,
        facilityType: FacilityType.Pharmacy,
      })
      .pipe(
        tap((response: any) => {
          this.facilityName = response.facilityName;
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
