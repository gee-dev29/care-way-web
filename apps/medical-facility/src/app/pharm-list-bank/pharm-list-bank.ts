import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedListBank } from '@care-way/ui';
import { ApiService, FacilityType } from '@care-way/api';
@Component({
  selector: 'medical-facility-pharm-list-bank',
  imports: [CommonModule, SharedListBank],
  templateUrl: './pharm-list-bank.html',
  styleUrl: './pharm-list-bank.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PharmListBank implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  pharmacyId: string;
  facilityType = FacilityType.Pharmacy;
  FacilityType = FacilityType;
  route: string;
  moreRoute: string;
  bg = '#F1ECF1';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.route = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-empty-address`;
      this.moreRoute = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-add-bank`;
    });
  }
}
