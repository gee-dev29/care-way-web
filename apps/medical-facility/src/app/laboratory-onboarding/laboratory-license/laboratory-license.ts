import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { FacilityType } from '@care-way/shared';
import { SharedLicense } from '@care-way/ui';

@Component({
  selector: 'medical-facility-laboratory-license',
  imports: [CommonModule, SharedLicense],
  templateUrl: './laboratory-license.html',
  styleUrl: './laboratory-license.css',
})
export class LaboratoryLicense implements OnInit {
  public api = inject(ApiService);
  facilityId: string;
  laboratoryId: string;
  facilityType = FacilityType.Laboratory;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  route: any;
  edit: any;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.laboratoryId = params.laboratoryId;
      this.edit = params.edit;
      if (params.edit) {
        this.route = `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}/laboratory-upload/edit`;
      } else {
        this.route = `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}/laboratory-upload`;
      }
    });
  }
  goBack() {
    if (this.edit) {
      this.router.navigateByUrl(
        `/dashboard/laboratory-profile/${this.facilityId}/${this.laboratoryId}`
      );
    } else {
      this.router.navigateByUrl(
        `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}`
      );
    }
  }
}
