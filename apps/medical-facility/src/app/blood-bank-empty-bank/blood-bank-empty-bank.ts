import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { SharedEmptyBank } from '@healbridge/ui';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'medical-facility-blood-bank-empty-bank',
  imports: [SharedEmptyBank, IonContent],
  templateUrl: './blood-bank-empty-bank.html',
  styleUrl: './blood-bank-empty-bank.css',
})
export class BloodBankEmptyBank implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityType = FacilityType.BloodBank;
  bloodBankId: string;
  facilityId: string;
  route: string;
  backRoute: string;
  bankRoute: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.facilityId = params.facilityId;
      this.bloodBankId = params.bloodBankId;
      this.route = `/dashboard/blood-bank-onboarding/${this.facilityId}/${this.bloodBankId}/blood-bank-add-bank`;
      this.backRoute = `/dashboard/blood-bank-onboarding/${this.facilityId}/${this.bloodBankId}/blood-bank-license-upload`;
      this.bankRoute = `/dashboard/blood-bank-onboarding/${this.facilityId}/${this.bloodBankId}/blood-bank-empty-address`;
    });
  }
}
