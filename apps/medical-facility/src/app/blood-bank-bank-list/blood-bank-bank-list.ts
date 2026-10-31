import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService, FacilityType } from '@care-way/api';

import { SharedListBank } from '@care-way/ui';

@Component({
  selector: 'medical-facility-blood-bank-bank-list',
  imports: [SharedListBank],
  templateUrl: './blood-bank-bank-list.html',
  styleUrl: './blood-bank-bank-list.css',
})
export class BloodBankBankList implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilitytype = FacilityType.BloodBank;
  FacilityType = FacilityType;
  route: string;
  moreRoute: string;
  bg = '#F4E7E7';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      if (params.edit) {
        this.route = `/dashboard/blood-bank-profile/${params.facilityId}/${params.bloodBankId}`;
        this.moreRoute = `/dashboard/blood-bank-onboarding/${params.facilityId}/${params.bloodBankId}/blood-bank-add-bank/edit`;
      } else {
        this.route = `/dashboard/blood-bank-onboarding/${params.facilityId}/${params.bloodBankId}/blood-bank-empty-address`;
        this.moreRoute = `/dashboard/blood-bank-onboarding/${params.facilityId}/${params.bloodBankId}/blood-bank-add-bank`;
      }
    });
  }
}
