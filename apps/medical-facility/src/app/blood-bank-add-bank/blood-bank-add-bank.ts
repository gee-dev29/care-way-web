import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService, FacilityType } from '@care-way/api';
import { SharedAddBank } from '@care-way/ui';

@Component({
  selector: 'medical-facility-blood-bank-add-bank',
  imports: [SharedAddBank],
  templateUrl: './blood-bank-add-bank.html',
  styleUrl: './blood-bank-add-bank.css',
})
export class BloodBankAddBank implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  facilityType = FacilityType.BloodBank;
  bloodBankId: string;
  route: string;
  backRoute: string;

  ngOnInit(): void {
    this.backRoute = history.state?.backRoute;
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.facilityId = params.facilityId;
      this.bloodBankId = params.bloodBankId;
      if (params.edit) {
        this.route = `/dashboard/blood-bank-profile/${this.facilityId}/${this.bloodBankId}`;
      } else {
        this.route = `/dashboard/blood-bank-onboarding/${this.facilityId}/${this.bloodBankId}/blood-bank-empty-bank`;
      }
      if (this.backRoute) {
        this.route = this.backRoute;
      }
    });
  }
}
