import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { FacilityType } from '@healbridge/shared';
import { SharedEmptyAddress } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-radiology-empty-address',
  imports: [CommonModule, SharedEmptyAddress],
  templateUrl: './radiology-empty-address.html',
  styleUrl: './radiology-empty-address.css',
})
export class RadiologyEmptyAddress implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  route: string;
  backRoute: string;
  facilityId: string;
  facilityType = FacilityType.Radiology;
  FacilityType = FacilityType;
  navigateTo: string;
  pharmacyId: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.route = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-add-address`;
      this.backRoute = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-empty-bank`;
      this.navigateTo = `/dashboard/onboarding/${this.facilityId}`;
    });
  }
}
