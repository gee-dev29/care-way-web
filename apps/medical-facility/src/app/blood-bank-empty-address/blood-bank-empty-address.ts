import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { FacilityType } from '@healbridge/shared';
import { SharedEmptyAddress } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-blood-bank-empty-address',
  imports: [SharedEmptyAddress],
  templateUrl: './blood-bank-empty-address.html',
  styleUrl: './blood-bank-empty-address.css',
})
export class BloodBankEmptyAddress implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  route: string;
  backRoute: string;
  facilityType = FacilityType['Blood Bank'];
  navigateTo: string;
  FacilityType = FacilityType;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.route = `/dashboard/blood-bank-onboarding/${params.facilityId}/${params.bloodBankId}/blood-bank-add-address`;
      this.backRoute = `/dashboard/blood-bank-onboarding/${params.facilityId}/${params.bloodBankId}/blood-bank-empty-bank`;
      this.navigateTo = `/dashboard/onboarding/${params.facilityId}`;
    });
  }
}
