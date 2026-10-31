import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { SharedLicense } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-scientist-license-details',
  imports: [IonContent, SharedLicense],
  templateUrl: './scientist-license-details.html',
  styleUrl: './scientist-license-details.css',
})
export class ScientistLicenseDetails implements OnInit {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  route: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.route = `/dashboard/scientist-license-upload/${params.facilityType}/${params.facilityId}/${params.professionalId}`;
    });
  }
}
