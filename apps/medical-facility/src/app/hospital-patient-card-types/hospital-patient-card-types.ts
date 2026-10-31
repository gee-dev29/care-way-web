import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { FacilityType } from '@care-way/shared';
import { PatientCardTypes } from '@care-way/ui';

@Component({
  selector: 'medical-facility-hospital-patient-card-types',
  imports: [PatientCardTypes],
  templateUrl: './hospital-patient-card-types.html',
  styleUrl: './hospital-patient-card-types.css',
})
export class HospitalPatientCardTypes implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  route: string;
  backRoute: string;
  navigateTo: string;
  facilityType = FacilityType.Hospital;
  FacilityType = FacilityType;
  facilityId: string;
  pharmacyId: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.route = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-add-patient-card-type`;
      this.navigateTo = `/dashboard/onboarding/${this.facilityId}`;
      this.backRoute = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-empty-address`;
    });
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.error) {
        this.route = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-add-patient-card-type?error=true`;
        this.navigateTo = `/dashboard/home`;
        this.backRoute = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-add-patient-card-type?error=true`;
      }
    });
  }
}
