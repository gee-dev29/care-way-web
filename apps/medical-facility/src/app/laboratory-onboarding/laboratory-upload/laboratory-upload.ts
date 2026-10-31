import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { UploadComponent } from '@care-way/ui';

@Component({
  selector: 'medical-facility-laboratory-upload',
  imports: [UploadComponent],
  templateUrl: './laboratory-upload.html',
  styleUrl: './laboratory-upload.css',
})
export class LaboratoryUpload implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  public api = inject(ApiService);
  route: string;
  edit = '';
  facilityId: string;
  laboratoryId: string;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.laboratoryId = params.laboratoryId;
      this.edit = params.edit;
      if (this.edit?.length) {
        this.route = `/dashboard/laboratory-profile/${this.facilityId}/${this.laboratoryId}`;
      } else {
        this.route = `/dashboard/laboratory-onboarding/${this.facilityId}/${this.laboratoryId}/laboratory-empty-bank`;
      }
    });
  }

  goback() {
    this.router.navigate([
      '/dashboard/laboratory-onboarding',
      this.facilityId,
      this.laboratoryId,
      'laboratory-license',
    ]);
  }
}
