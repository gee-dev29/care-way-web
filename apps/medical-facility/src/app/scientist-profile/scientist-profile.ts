import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, ProfessionalType } from '@care-way/api';
import { SharedProfile } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-scientist-profile',
  imports: [IonContent, SharedProfile],
  templateUrl: './scientist-profile.html',
  styleUrl: './scientist-profile.css',
})
export class ScientistProfile implements OnInit {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  professionalType = ProfessionalType.LaboratoryStaff;
  route: any;
  addRoute = '/dashboard/add-scientist';
  licenseRoute = '/scientist-license-details';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.route = `/dashboard/scientist-profile/${params.facilityType}/${params.facilityId}/${params.professionalId}/upload-profile-picture`;
    });
  }
}
