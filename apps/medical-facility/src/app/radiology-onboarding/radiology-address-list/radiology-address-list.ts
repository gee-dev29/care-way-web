import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { SharedListAddress } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-radiology-address-list',
  imports: [CommonModule, SharedListAddress],
  templateUrl: './radiology-address-list.html',
  styleUrl: './radiology-address-list.css',
})
export class RadiologyAddressList implements OnInit {
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
      this.route = `/dashboard/onboarding/${this.facilityId}`;
      this.moreRoute = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-add-address`;
    });
  }
}
