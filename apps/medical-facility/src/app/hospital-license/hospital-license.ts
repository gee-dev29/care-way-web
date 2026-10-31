import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { FacilityType } from '@healbridge/shared';
import { SharedLicense } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-hospital-license',
  imports: [CommonModule, SharedLicense],
  templateUrl: './hospital-license.html',
  styleUrl: './hospital-license.css',
})
export class HospitalLicense implements OnInit {
  public api = inject(ApiService);
  facilityId: string;
  pharmacyId: string;
  facilityType = FacilityType.Hospital;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  route: any;
  edit: any;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.edit = params.edit;
      if (params.edit) {
        this.route = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-upload/edit`;
      } else {
        this.route = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-upload`;
      }
    });
  }
  goBack() {
    if (this.edit) {
      this.router.navigateByUrl(
        `/dashboard/hospital-profile/${this.facilityId}/${this.pharmacyId}`
      );
    } else {
      this.router.navigateByUrl(
        `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}`
      );
    }
  }
}
