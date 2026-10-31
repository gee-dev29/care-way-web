import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, FacilityType } from '@care-way/api';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedLicense } from '@care-way/ui';

@Component({
  selector: 'medical-facility-pharm-license',
  imports: [CommonModule, SharedLicense],
  templateUrl: './pharm-license.html',
  styleUrl: './pharm-license.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PharmLicense implements OnInit {
  public api = inject(ApiService);
  facilityId: string;
  pharmacyId: string;
  facilityType = FacilityType.Pharmacy;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  route: any;
  edit: any;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.edit = params.edit;
      if (params.edit) {
        this.route = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-upload/edit`;
      } else {
        this.route = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-upload`;
      }
    });
  }
  goBack() {
    if (this.edit) {
      this.router.navigateByUrl(
        `/dashboard/pharm-profile/${this.facilityId}/${this.pharmacyId}`
      );
    } else {
      this.router.navigateByUrl(
        `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}`
      );
    }
  }
}
