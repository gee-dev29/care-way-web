import { Component, inject, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedLicense } from '@healbridge/ui';
import { ApiService } from '@healbridge/api';

@Component({
  selector: 'medical-facility-pharmacy-license-details',
  imports: [IonContent, SharedLicense],
  templateUrl: './pharmacy-license-details.html',
  styleUrl: './pharmacy-license-details.css',
})
export class PharmacyLicenseDetails implements OnInit {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  route: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.route = `/dashboard/pharmacist-license-upload/${params.facilityType}/${params.facilityId}/${params.professionalId}`;
    });
  }
}
