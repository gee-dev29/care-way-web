import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { SharedListAddress } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-blood-bank-address-list',
  imports: [SharedListAddress],
  templateUrl: './blood-bank-address-list.html',
  styleUrl: './blood-bank-address-list.css',
})
export class BloodBankAddressList implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityType = FacilityType.BloodBank;
  FacilityType = FacilityType;
  route: string;
  moreRoute: string;
  bg = '#F4E7E7';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.route = `/dashboard/onboarding/${params.facilityId}`;
      this.moreRoute = `/dashboard/blood-bank-onboarding/${params.facilityId}/${params.pharmacyId}/blood-bank-add-address`;
    });
  }
}
