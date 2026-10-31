import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { UploadComponent } from '@care-way/ui';

@Component({
  selector: 'medical-facility-blood-bank-license-upload',
  imports: [UploadComponent],
  templateUrl: './blood-bank-license-upload.html',
  styleUrl: './blood-bank-license-upload.css',
})
export class BloodBankLicenseUpload implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  public api = inject(ApiService);
  route: string;
  edit = '';
  bloodBankId: string;
  facilityId: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.bloodBankId = params.bloodBankId;
      this.facilityId = params.facilityId;
      this.edit = params.edit;
      if (this.edit?.length) {
        this.route = `/dashboard/blood-bank-profile/${this.facilityId}/${this.bloodBankId}`;
      } else {
        this.route = `/dashboard/blood-bank-onboarding/${this.facilityId}/${this.bloodBankId}/blood-bank-empty-bank`;
      }
    });
  }

  goback() {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.router.navigate([
        '/dashboard/blood-bank-onboarding',
        params.facilityId,
        params.bloodBankId,
        'blood-bank-license-details',
      ]);
    });
  }
}
