import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService, FacilityType } from '@care-way/api';
import { SharedListAddress } from '@care-way/ui';

@Component({
  selector: 'medical-facility-hospital-address-list',
  imports: [CommonModule, SharedListAddress],
  templateUrl: './hospital-address-list.html',
  styleUrl: './hospital-address-list.css',
})
export class HospitalAddressList implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  facilityType = FacilityType.Hospital;
  FacilityType = FacilityType;
  pharmacyId: string;
  route: string;
  moreRoute: string;
  bg = '#E5E7F6';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.route = `/dashboard/onboarding/${this.facilityId}`;
      this.moreRoute = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-add-address`;
    });
  }
}
