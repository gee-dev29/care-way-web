import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AddPatientCardType } from '@care-way/ui';

@Component({
  selector: 'medical-facility-hospital-add-patient-card-type',
  imports: [AddPatientCardType],
  templateUrl: './hospital-add-patient-card-type.html',
  styleUrl: './hospital-add-patient-card-type.css',
})
export class HospitalAddPatientCardType implements OnInit {
  public api = inject(ApiService);
  private route = inject(ActivatedRoute);
  navigateTo: string;
  didFacilityMissOnboarding = false;
  facilityId: string;
  pharmacyId: string;

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      if (params.edit) {
        this.navigateTo = `/dashboard/hospital-profile/${this.facilityId}/${this.pharmacyId}`;
      } else {
        this.navigateTo = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-patient-card-types`;
      }
    });
    this.route.queryParams.subscribe((params: any) => {
      if (params.error) {
        this.didFacilityMissOnboarding = true;
        this.navigateTo = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-patient-card-types?error=true`;
      }
    });
  }
}
