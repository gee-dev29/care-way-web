import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@care-way/api';
import { SharedAddBank } from '@care-way/ui';

@Component({
  selector: 'medical-facility-hospital-add-bank',
  imports: [CommonModule, SharedAddBank],
  templateUrl: './hospital-add-bank.html',
  styleUrl: './hospital-add-bank.css',
})
export class HospitalAddBank implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  facilityType = FacilityType.Pharmacy;
  pharmacyId: string;
  route: string;
  backRoute: string;

  ngOnInit(): void {
    this.backRoute = history.state?.backRoute;
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      if (params.edit) {
        this.route = `/dashboard/hospital-profile/${this.facilityId}/${this.pharmacyId}`;
      } else {
        this.route = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-empty-bank`;
      }
      if (this.backRoute) {
        this.route = this.backRoute;
      }
    });
  }
}
