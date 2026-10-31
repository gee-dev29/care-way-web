import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { FacilityType } from '@care-way/shared';
import { SharedEmptyAddress } from '@care-way/ui';

@Component({
  selector: 'medical-facility-laboratory-empty-address',
  imports: [CommonModule, SharedEmptyAddress],
  templateUrl: './laboratory-empty-address.html',
  styleUrl: './laboratory-empty-address.css',
})
export class LaboratoryEmptyAddress implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  route: string;
  backRoute: string;
  facilityId: string;
  facilityType = FacilityType.Laboratory;
  FacilityType = FacilityType;
  laboratoryId: string;
  navigateTo: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.laboratoryId = params.laboratoryId;
      this.route = `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}/laboratory-add-address`;
      this.backRoute = `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}/laboratory-empty-bank`;
      this.navigateTo = `/dashboard/onboarding/${this.facilityId}`;
    });
  }
}
