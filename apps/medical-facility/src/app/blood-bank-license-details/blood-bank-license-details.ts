import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { FacilityType } from '@care-way/shared';
import { SharedLicense } from '@care-way/ui';

@Component({
  selector: 'medical-facility-blood-bank-license-details',
  imports: [SharedLicense],
  templateUrl: './blood-bank-license-details.html',
  styleUrl: './blood-bank-license-details.css',
})
export class BloodBankLicenseDetails implements OnInit {
  public api = inject(ApiService);
  facilityId: string;
  pharmacyId: string;
  bloodBankId: string;
  facilityType = FacilityType['Blood Bank'];
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  route: any;
  edit: any;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.bloodBankId = params.bloodBankId;
      this.edit = params.edit;
      if (params.edit) {
        this.route = `/dashboard/blood-bank-onboarding/${this.facilityId}/${this.pharmacyId}/blood-bank-license-upload/edit`;
      } else {
        this.route = `/dashboard/blood-bank-onboarding/${params.facilityId}/${params.bloodBankId}/blood-bank-license-upload`;
      }
    });
  }
  goBack() {
    if (this.edit) {
      this.router.navigateByUrl(
        `/dashboard/blood-bank-profile/${this.facilityId}/${this.bloodBankId}`
      );
    } else {
      this.router.navigateByUrl(
        `/dashboard/blood-bank-onboarding/${this.facilityId}/${this.bloodBankId}`
      );
    }
  }
}
