import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, ProfessionalType } from '@healbridge/api';
import { SharedProfile } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';
@Component({
  selector: 'medical-facility-pharmacist-details',
  imports: [IonContent, SharedProfile],
  templateUrl: './pharmacist-details.html',
  styleUrl: './pharmacist-details.css',
})
export class PharmacistDetails implements OnInit {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  professionalType = ProfessionalType.Pharmacist;
  route: any;
  addRoute = '/dashboard/add-pharmacist';
  licenseRoute = '/dashboard/pharmacist-license-details';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.route = `/dashboard/pharmacist-profile/${params.facilityType}/${params.facilityId}/${params.professionalId}/upload-profile-picture`;
    });
  }
}
