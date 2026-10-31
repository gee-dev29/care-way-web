import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@care-way/api';
import { SharedListBank } from '@care-way/ui';

@Component({
  selector: 'medical-facility-radiology-bank-list',
  imports: [CommonModule, SharedListBank],
  templateUrl: './radiology-bank-list.html',
  styleUrl: './radiology-bank-list.css',
})
export class RadiologyBankList implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  facilityType = FacilityType.Radiology;
  FacilityType = FacilityType;
  pharmacyId: string;
  route: string;
  moreRoute: string;
  bg = '#FBFBD8';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      if (params.edit) {
        this.route = `/dashboard/radiology-profile/${this.facilityId}/${this.pharmacyId}`;
        this.moreRoute = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-add-bank/edit`;
      } else {
        this.route = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-empty-address`;
        this.moreRoute = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-add-bank`;
      }
    });
  }
}
