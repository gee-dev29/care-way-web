import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { UploadComponent } from '@care-way/ui';

@Component({
  selector: 'medical-facility-hospital-upload',
  imports: [UploadComponent],
  templateUrl: './hospital-upload.html',
  styleUrl: './hospital-upload.css',
})
export class HospitalUpload implements OnInit {
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
        this.route = `/dashboard/hospital-profile/${this.facilityId}/${this.pharmacyId}`;
      } else {
        this.route = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-empty-bank`;
      }
    });
  }

  goback() {
    this.router.navigate([
      '/dashboard/hospital-onboarding',
      this.facilityId,
      this.pharmacyId,
      'hospital-license',
    ]);
  }
}
