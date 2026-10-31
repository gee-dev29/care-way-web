import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { UploadComponent } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'medical-facility-upload-doctors-license',
  imports: [IonContent, UploadComponent],
  templateUrl: './upload-doctors-license.html',
  styleUrl: './upload-doctors-license.css',
})
export class UploadDoctorsLicense implements OnInit {
  router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  referencedDocumentId: any;
  public api = inject(ApiService);
  route: string;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.referencedDocumentId = params.professionalId;
      if (this.router.url.includes('doctor-dashboard')) {
        this.route = `doctor-dashboard/${params.professionalId}/doctor-details`;
      } else {
        this.route = `dashboard/doctor-profile/${params.facilityType}/${params.facilityId}/${params.professionalId}`;
      }
    });
  }

  onSkip() {
    this.router.navigateByUrl(this.route);
  }
  goback(route: string) {
    this.router.navigateByUrl(route);
  }
}
