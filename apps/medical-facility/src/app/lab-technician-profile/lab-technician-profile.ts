import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, ProfessionalType } from '@healbridge/api';
import { SharedProfile } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-lab-technician-profile',
  imports: [IonContent, SharedProfile],
  templateUrl: './lab-technician-profile.html',
  styleUrl: './lab-technician-profile.css',
})
export class LabTechnicianProfile implements OnInit {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  professionalType = ProfessionalType.BloodBankStaff;
  route: any;
  addRoute = '/dashboard/add-lab-technician';
  licenseRoute = 'dashboard/lab-technician-license-details';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.route = `/dashboard/lab-technician-profile/${params.facilityType}/${params.facilityId}/${params.professionalId}/upload-profile-picture`;
    });
  }
}
