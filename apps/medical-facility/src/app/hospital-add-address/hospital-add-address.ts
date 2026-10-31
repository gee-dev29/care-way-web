import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { environment } from '@care-way/shared';
import { SharedAddAddress } from '@care-way/ui';

@Component({
  selector: 'medical-facility-hospital-add-address',
  imports: [SharedAddAddress],
  templateUrl: './hospital-add-address.html',
  styleUrl: './hospital-add-address.css',
})
export class HospitalAddAddress implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  facilityId: string;
  public api = inject(ApiService);
  pharmacyId: string;
  route: string;
  backRoute: string;
  apiKey = environment.mapKey;

  async ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      if (params.edit) {
        this.route = `/dashboard/hospital-profile/${this.facilityId}/${this.pharmacyId}`;
        this.backRoute = this.route;
      } else {
        this.route = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-empty-address`;
        this.backRoute = this.route;
      }
    });
  }
}
