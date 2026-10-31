import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { SharedAddBank } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-radiology-add-bank',
  imports: [CommonModule, SharedAddBank],
  templateUrl: './radiology-add-bank.html',
  styleUrl: './radiology-add-bank.css',
})
export class RadiologyAddBank implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  pharmacyId: string;
  facilityType = FacilityType.Radiology;
  route: string;
  backRoute: string;

  ngOnInit(): void {
    this.backRoute = history.state?.backRoute;
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      if (params.edit) {
        this.route = `/dashboard/radiology-profile/${this.facilityId}/${this.pharmacyId}`;
      } else {
        this.route = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-empty-bank`;
      }
      if (this.backRoute) {
        this.route = this.backRoute;
      }
    });
  }
}
