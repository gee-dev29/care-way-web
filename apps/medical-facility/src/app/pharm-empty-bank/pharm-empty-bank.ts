import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedEmptyBank } from '@healbridge/ui';
import { ApiService, FacilityType } from '@healbridge/api';
import { IonContent } from "@ionic/angular/standalone";
@Component({
  selector: 'medical-facility-pharm-empty-bank',
  imports: [CommonModule, SharedEmptyBank, IonContent],
  templateUrl: './pharm-empty-bank.html',
  styleUrl: './pharm-empty-bank.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PharmEmptyBank {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  facilityType = FacilityType.Pharmacy;
  pharmacyId: string;
  route: string;
  backRoute: string;
  bankRoute: string;

  ionViewWillEnter() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.route = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-add-bank`;
      this.backRoute = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-upload`;
      this.bankRoute = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-empty-address`;
    });
  }
}
