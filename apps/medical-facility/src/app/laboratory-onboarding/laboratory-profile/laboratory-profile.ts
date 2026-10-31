import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@care-way/api';
import { ProfileInfoService } from '@care-way/shared';
import { SharedProfilePage } from '@care-way/ui';

@Component({
  selector: 'medical-facility-laboratory-profile',
  imports: [SharedProfilePage],
  templateUrl: './laboratory-profile.html',
  styleUrl: './laboratory-profile.css',
})
export class LaboratoryProfile implements OnInit {
  facilityType = FacilityType.Laboratory;
  public profileInfoService: any = inject(ProfileInfoService);
  public activatedRoute = inject(ActivatedRoute);
  FacilityType = FacilityType;
  public api = inject(ApiService);
  greenBookType: any = [];
  route: string;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.route = `/dashboard/laboratory-profile/${params.facilityId}/${params.laboratoryId}/upload-profile-picture`;
    });
  }
}
