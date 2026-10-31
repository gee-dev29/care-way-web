import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@care-way/api';
import { ProfileInfoService } from '@care-way/shared';
import { SharedProfilePage } from '@care-way/ui';

@Component({
  selector: 'medical-facility-blood-bank-profile',
  imports: [SharedProfilePage],
  templateUrl: './blood-bank-profile.html',
  styleUrl: './blood-bank-profile.css',
})
export class BloodBankProfile implements OnInit {
  public api = inject(ApiService);
  public activatedRoute = inject(ActivatedRoute);
  public profileInfoService: any = inject(ProfileInfoService);
  facilityType = FacilityType.BloodBank;
  FacilityType = FacilityType;
  greenBookType: any = [];
  route: any;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.route = `/dashboard/blood-bank-profile/${params.facilityId}/${params.bloodBankId}/upload-profile-picture`;
      this.api
        .getFacilityTypeById({
          facilityId: params.facilityId,
          facilityType: this.facilityType,
          facilityTypeId: params.bloodBankId,
        })
        .subscribe((response: any) => {
          this.greenBookType = response.bloodProducts;
        });
    });
  }
}
