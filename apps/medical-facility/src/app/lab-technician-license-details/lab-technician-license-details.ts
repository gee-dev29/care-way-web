import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { SharedLicense } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-lab-technician-license-details',
  imports: [IonContent, SharedLicense],
  templateUrl: './lab-technician-license-details.html',
  styleUrl: './lab-technician-license-details.css',
})
export class LabTechnicianLicenseDetails implements OnInit {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  route: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.route = `/lab-technician-license-upload/${params.facilityType}/${params.facilityId}/${params.professionalId}`;
    });
  }
}
