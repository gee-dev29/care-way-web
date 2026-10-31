import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { SharedListBank } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-hospital-bank-list',
  imports: [CommonModule, SharedListBank],
  templateUrl: './hospital-bank-list.html',
  styleUrl: './hospital-bank-list.css',
})
export class HospitalBankList implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  facilitytype = FacilityType.Hospital;
  FacilityType = FacilityType;
  pharmacyId: string;
  route: string;
  moreRoute: string;
  bg = '#E5E7F6';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      if (params.edit) {
        this.route = `/dashboard/hospital-profile/${this.facilityId}/${this.pharmacyId}`;
        this.moreRoute = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-add-bank/edit`;
      } else {
        this.route = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-empty-address`;
        this.moreRoute = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-add-bank`;
      }
    });
  }
}
