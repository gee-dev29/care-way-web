import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { UploadComponent, ButtonComponent } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-upload-lab-technician-license',
  imports: [UploadComponent, IonContent, ButtonComponent],
  templateUrl: './upload-lab-technician-license.html',
  styleUrl: './upload-lab-technician-license.css',
})
export class UploadLabTechnicianLicense implements OnInit {
  router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  referencedDocumentId: any;
  public api = inject(ApiService);
  route: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.referencedDocumentId = params.professionalId;
      this.route = `/dashboard/lab-technician-profile/${params.facilityType}/${params.facilityId}/${params.professionalId}`;
    });
  }

  onSkip() {
    this.router.navigateByUrl(this.route);
  }
  goBack(route: string) {
    this.router.navigateByUrl(route);
  }
}
