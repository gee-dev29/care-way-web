import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@care-way/api';
import { ProfileInfoService } from '@care-way/shared';
import { SharedProfilePage } from '@care-way/ui';

@Component({
  selector: 'medical-facility-hospital-profile',
  imports: [SharedProfilePage],
  templateUrl: './hospital-profile.html',
  styleUrl: './hospital-profile.css',
})
export class HospitalProfile implements OnInit {
  public api = inject(ApiService);
  public activatedRoute = inject(ActivatedRoute);
  public profileInfoService = inject(ProfileInfoService);
  facilityType = FacilityType.Hospital;
  FacilityType = FacilityType;
  route: string;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.route = `/dashboard/hospital-profile/${params.facilityId}/${params.pharmacyId}/upload-profile-picture`;
    });
  }
}
