import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { SharedLicense } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-radiologist-license-details',
  imports: [IonContent, SharedLicense],
  templateUrl: './radiologist-license-details.html',
  styleUrl: './radiologist-license-details.css',
})
export class RadiologistLicenseDetails implements OnInit {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  route: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.route = `dashboard/radiologist-license-upload/${params.facilityType}/${params.facilityId}/${params.professionalId}`;
    });
  }
}
