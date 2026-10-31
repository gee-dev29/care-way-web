import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { FacilityType } from '@care-way/shared';
import { SharedEmptyAddress } from '@care-way/ui';

@Component({
  selector: 'medical-facility-hospital-empty-address',
  imports: [CommonModule, SharedEmptyAddress],
  templateUrl: './hospital-empty-address.html',
  styleUrl: './hospital-empty-address.css',
})
export class HospitalEmptyAddress implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  route: string;
  navigateTo: string;
  backRoute: string;
  facilityId: string;
  facilityType = FacilityType.Hospital;
  FacilityType = FacilityType;
  pharmacyId: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.route = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-add-address`;
      this.navigateTo = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-patient-card-types`;
      this.backRoute = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-bank-list`;
    });
  }
}
