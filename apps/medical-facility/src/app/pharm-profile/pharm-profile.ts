import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { ProfileInfoService } from '@healbridge/shared';
import { SharedProfilePage } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-pharm-profile',
  imports: [SharedProfilePage, IonContent],
  templateUrl: './pharm-profile.html',
  styleUrl: './pharm-profile.css',
})
export class PharmProfile implements OnInit {
  public api = inject(ApiService);
  public activatedRoute = inject(ActivatedRoute);
  public profileInfoService: any = inject(ProfileInfoService);
  facilityType = FacilityType.Pharmacy;
  FacilityType = FacilityType;
  greenBookType: any = [];
  route: any;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.route = `/dashboard/pharm-profile/${params.facilityId}/${params.pharmacyId}/upload-profile-picture`;
      this.api
        .getFacilityTypeById({
          facilityId: params.facilityId,
          facilityType: this.facilityType,
          facilityTypeId: params.pharmacyId,
        })
        .subscribe((response: any) => {
          this.greenBookType = response.productCategories;
        });
    });
  }
}
