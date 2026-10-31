import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@care-way/api';
import { SharedAddBank } from '@care-way/ui';

@Component({
  selector: 'medical-facility-laboratory-add-bank',
  imports: [CommonModule, SharedAddBank],
  templateUrl: './laboratory-add-bank.html',
  styleUrl: './laboratory-add-bank.css',
})
export class LaboratoryAddBank implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  laboratoryId: string;
  facilityType = FacilityType.Laboratory;
  route: string;
  backRoute: string;

  ngOnInit(): void {
    this.backRoute = history.state?.backRoute;
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.laboratoryId = params.laboratoryId;
      if (params.edit) {
        this.route = `/dashboard/laboratory-profile/${this.facilityId}/${this.laboratoryId}`;
      } else {
        this.route = `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}/laboratory-empty-bank`;
      }
      if (this.backRoute) {
        this.route = this.backRoute;
      }
    });
  }
}
