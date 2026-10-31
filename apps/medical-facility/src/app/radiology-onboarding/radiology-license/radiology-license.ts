import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { FacilityType } from '@healbridge/shared';
import { SharedLicense } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-radiology-license',
  imports: [CommonModule, SharedLicense],
  templateUrl: './radiology-license.html',
  styleUrl: './radiology-license.css',
})
export class RadiologyLicense implements OnInit {
  public api = inject(ApiService);
  facilityId: string;
  pharmacyId: string;
  facilityType = FacilityType.Radiology;
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
        this.route = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-upload/edit`;
      } else {
        this.route = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-upload`;
      }
    });
  }
  goBack() {
    if (this.edit) {
      this.router.navigateByUrl(
        `/dashboard/radiology-profile/${this.facilityId}/${this.pharmacyId}`
      );
    } else {
      this.router.navigateByUrl(
        `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}`
      );
    }
  }
}
