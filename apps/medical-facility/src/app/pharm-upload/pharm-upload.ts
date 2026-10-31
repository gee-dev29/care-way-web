import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { UploadComponent } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-pharm-upload',
  imports: [UploadComponent],
  templateUrl: './pharm-upload.html',
  styleUrl: './pharm-upload.css',
})
export class PharmUpload implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  public api = inject(ApiService);
  route: string;
  edit = '';
  facilityId: string;
  pharmacyId: string;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.edit = params.edit;
      if (this.edit?.length) {
        this.route = `/dashboard/pharm-profile/${this.facilityId}/${this.pharmacyId}`;
      } else {
        this.route = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-empty-bank`;
      }
    });
  }

  goback() {
    this.router.navigate([
      '/dashboard/pharmacy-onboarding',
      this.facilityId,
      this.pharmacyId,
      'pharm-license',
    ]);
  }
}
