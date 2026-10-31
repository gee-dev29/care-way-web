import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '@care-way/api';
import { environment } from '@care-way/shared';
import { SharedAddAddress } from '@care-way/ui';

@Component({
  selector: 'medical-facility-blood-bank-add-address',
  imports: [SharedAddAddress],
  templateUrl: './blood-bank-add-address.html',
  styleUrl: './blood-bank-add-address.css',
})
export class BloodBankAddAddress implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  bloodBankId: string;
  route: string;
  backRoute: string;
  apiKey = environment.mapKey;

  async ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.facilityId = params.facilityId;
      this.bloodBankId = params.bloodBankId;
      if (params.edit) {
        this.route = `/dashboard/blood-bank-profile/${this.facilityId}/${this.bloodBankId}`;
        this.backRoute = this.route;
      } else {
        this.route = `/dashboard/blood-bank-onboarding/${this.facilityId}/${this.bloodBankId}/blood-bank-empty-address`;
        this.backRoute = this.route;
      }
    });
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.patch) {
        this.route = `/dashboard/blood-bank-onboarding/${this.facilityId}/${this.bloodBankId}/blood-bank-empty-address/patch`;
        this.backRoute = this.route;
      }
    });
  }
}
