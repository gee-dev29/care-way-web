import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { UploadComponent } from '@care-way/ui';

@Component({
  selector: 'medical-facility-radiology-upload',
  imports: [UploadComponent],
  templateUrl: './radiology-upload.html',
  styleUrl: './radiology-upload.css',
})
export class RadiologyUpload implements OnInit {
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
        this.route = `/dashboard/radiology-profile/${this.facilityId}/${this.pharmacyId}`;
      } else {
        this.route = `/dashboard/radiology-onboarding/${this.facilityId}/${this.pharmacyId}/radiology-empty-bank`;
      }
    });
  }

  goback() {
    this.router.navigate([
      '/dashboard/radiology-onboarding',
      this.facilityId,
      this.pharmacyId,
      'radiology-license',
    ]);
  }
}
