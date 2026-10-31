import { Component, inject, OnInit } from '@angular/core';
import { UploadComponent } from '@healbridge/ui';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { ApiService } from '@healbridge/api';

@Component({
  selector: 'medical-facility-upload-pharmacist-license',
  imports: [UploadComponent, IonContent],
  templateUrl: './upload-pharmacist-license.html',
  styleUrl: './upload-pharmacist-license.css',
})
export class UploadPharmacistLicense implements OnInit {
  private router = inject(Router);
  public api = inject(ApiService);
  displayImage: string;
  private activatedRoute = inject(ActivatedRoute);
  route: string;
  backRoute: string;
  professionalId: any;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.professionalId = params.professionalId;
      this.route = `/dashboard/pharmacist-profile/${params.facilityType}/${params.facilityId}/${params.professionalId}`;
      this.backRoute = `/dashboard/pharmacist-license-details/${params.facilityType}/${params.facilityId}/${params.professionalId}`;
    });
  }

  onSkip() {
    this.router.navigateByUrl(this.route);
  }
  goBack() {
    this.router.navigateByUrl(this.backRoute);
  }
}
