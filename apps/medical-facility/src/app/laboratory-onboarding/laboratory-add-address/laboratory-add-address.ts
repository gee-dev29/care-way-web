import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { environment } from '@care-way/shared';
import { SharedAddAddress } from '@care-way/ui';

@Component({
  selector: 'medical-facility-laboratory-add-address',
  imports: [SharedAddAddress],
  templateUrl: './laboratory-add-address.html',
  styleUrl: './laboratory-add-address.css',
})
export class LaboratoryAddAddress implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  laboratoryId: string;
  route: string;
  backRoute: string;
  apiKey = environment.mapKey;

  async ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.laboratoryId = params.laboratoryId;
      if (params.edit) {
        this.route = `/dashboard/laboratory-profile/${this.facilityId}/${this.laboratoryId}`;
        this.backRoute = this.route;
      } else {
        this.route = `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}/laboratory-empty-address`;
        this.backRoute = this.route;
      }
    });
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.patch) {
        this.route = `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}/laboratoryId-empty-address/patch`;
        this.backRoute = this.route;
      }
    });
  }
}
