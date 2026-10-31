import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { SharedListBank } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-laboratory-bank-list',
  imports: [CommonModule, SharedListBank],
  templateUrl: './laboratory-bank-list.html',
  styleUrl: './laboratory-bank-list.css',
})
export class LaboratoryBankList implements OnInit {
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
      this.route = `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}/laboratory-empty-address`;
      this.moreRoute = `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}/laboratory-add-bank`;
    });
  }
}
