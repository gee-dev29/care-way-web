import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, ProfessionalType } from '@care-way/api';
import { IonContent } from '@ionic/angular/standalone';
import { SharedProfile } from '@care-way/ui';

@Component({
  selector: 'medical-facility-radiologist-profile',
  imports: [IonContent, SharedProfile],
  templateUrl: './radiologist-profile.html',
  styleUrl: './radiologist-profile.css',
})
export class RadiologistProfile implements OnInit {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  professionalType = ProfessionalType.RadiologyStaff;
  route: any;
  addRoute = '/dashboard/add-radiologist';
  licenseRoute = 'dashboard/radiologist-license-details';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.route = `/dashboard/radiologist-profile/${params.facilityType}/${params.facilityId}/${params.professionalId}/upload-profile-picture`;
    });
  }
}
