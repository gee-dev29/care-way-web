import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { FacilityType } from '@healbridge/shared';
import { SharedEmptyBank } from '@healbridge/ui';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'medical-facility-radiology-empty-bank',
  imports: [CommonModule, SharedEmptyBank, IonContent],
  templateUrl: './radiology-empty-bank.html',
  styleUrl: './radiology-empty-bank.css',
})
export class RadiologyEmptyBank implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  facilityType = FacilityType.Radiology;
  FacilityType = FacilityType;
  pharmacyId: string;
  route: string;
  backRoute: string;
  bankRoute: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.route = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-add-bank`;
      this.backRoute = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-upload`;
      this.bankRoute = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-empty-address`;
    });
  }
}
