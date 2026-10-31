import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { ProfileInfoService } from '@healbridge/shared';
import { SharedProfilePage } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-radiology-profile',
  imports: [SharedProfilePage],
  templateUrl: './radiology-profile.html',
  styleUrl: './radiology-profile.css',
})
export class RadiologyProfile implements OnInit {
  public api = inject(ApiService);
  public activatedRoute = inject(ActivatedRoute);
  public profileInfoService: any = inject(ProfileInfoService);
  facilityType = FacilityType.Radiology;
  FacilityType = FacilityType;
  greenBookType: any = [];
  route: any;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.route = `/dashboard/radiology-profile/${params.facilityId}/${params.radiologyId}/upload-profile-picture`;
      this.api
        .getFacilityTypeById({
          facilityId: params.facilityId,
          facilityType: this.facilityType,
          facilityTypeId: params.radiologyId,
        })
        .subscribe((response: any) => {
          this.greenBookType = response.specializations;
        });
    });
  }
}
