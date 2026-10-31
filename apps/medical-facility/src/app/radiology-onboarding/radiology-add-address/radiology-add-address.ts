import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { environment } from '@healbridge/shared';
import { SharedAddAddress } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-radiology-add-address',
  imports: [SharedAddAddress],
  templateUrl: './radiology-add-address.html',
  styleUrl: './radiology-add-address.css',
})
export class RadiologyAddAddress implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  pharmacyId: string;
  route: string;
  patch = false;
  backRoute: string;
  apiKey = environment.mapKey;

  async ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      if (params.edit) {
        this.route = `/dashboard/radiology-profile/${this.facilityId}/${this.pharmacyId}`;
      } else {
        this.route = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-empty-address`;
        this.backRoute = this.route;
      }
    });
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.patch) {
        this.patch = true;
        this.route = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-empty-address/patch`;
        this.backRoute = this.route;
      }
    });
  }
}
