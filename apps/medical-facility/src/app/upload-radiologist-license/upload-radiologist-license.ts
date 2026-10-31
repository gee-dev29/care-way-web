import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { UploadComponent } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-upload-radiologist-license',
  imports: [UploadComponent, IonContent],
  templateUrl: './upload-radiologist-license.html',
  styleUrl: './upload-radiologist-license.css',
})
export class UploadRadiologistLicense implements OnInit {
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
      this.route = `/dashboard/radiologist-profile/${params.facilityType}/${params.facilityId}/${params.professionalId}`;
      this.backRoute = `/radiologist-license-details/${params.facilityType}/${params.facilityId}/${params.professionalId}`;
    });
  }

  onSkip() {
    this.router.navigateByUrl(this.route);
  }
  goBack() {
    this.router.navigateByUrl(this.backRoute);
  }
}
