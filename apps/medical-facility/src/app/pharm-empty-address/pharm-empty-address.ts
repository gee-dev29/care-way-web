import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedEmptyAddress } from '@healbridge/ui';
import { ApiService, FacilityType } from '@healbridge/api';

@Component({
  selector: 'medical-facility-pharm-empty-address',
  imports: [CommonModule, SharedEmptyAddress],
  templateUrl: './pharm-empty-address.html',
  styleUrl: './pharm-empty-address.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PharmEmptyAddress implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  route: string;
  backRoute: string;
  public api = inject(ApiService);
  facilityId: string;
  facilityType = FacilityType.Pharmacy;
  FacilityType = FacilityType;
  pharmacyId: string;
  navigateRoute: any;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.route = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-add-address`;
      this.backRoute = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-empty-bank`;
      this.navigateRoute = `/dashboard/onboarding/${this.facilityId}`;
    });
  }
}
