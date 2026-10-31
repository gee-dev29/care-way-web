import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { SharedListAddress } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-laboratory-address-list',
  imports: [CommonModule, SharedListAddress],
  templateUrl: './laboratory-address-list.html',
  styleUrl: './laboratory-address-list.css',
})
export class LaboratoryAddressList implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  facilityType = FacilityType.Laboratory;
  FacilityType = FacilityType;
  laboratoryId: string;
  route: string;
  moreRoute: string;
  bg = '#D1E0EC';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.laboratoryId = params.laboratoryId;
      this.route = `/dashboard/onboarding/${this.facilityId}`;
      this.moreRoute = `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}/laboratory-add-address`;
    });
  }
}
