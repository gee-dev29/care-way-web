import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { UploadComponent } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-upload-scientist-license',
  imports: [UploadComponent, IonContent],
  templateUrl: './upload-scientist-license.html',
  styleUrl: './upload-scientist-license.css',
})
export class UploadScientistLicense implements OnInit {
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

      this.route = `/dashboard/scientist-profile/${params.facilityType}/${params.facilityId}/${params.professionalId}`;
      this.backRoute = `/dashboard/scientist-license-details/${params.facilityType}/${params.facilityId}/${params.professionalId}`;
    });
  }

  onSkip() {
    this.router.navigateByUrl(this.route);
  }
  goBack() {
    this.router.navigateByUrl(this.backRoute);
  }
}
