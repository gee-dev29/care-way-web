import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { v4 } from 'uuid';
import { SharedListAddress } from '@care-way/ui';
import { ApiService, FacilityType } from '@care-way/api';
import { IonContent } from '@ionic/angular/standalone';
@Component({
  selector: 'medical-facility-pharm-list-address',
  imports: [CommonModule, SharedListAddress, IonContent],
  templateUrl: './pharm-list-address.html',
  styleUrl: './pharm-list-address.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PharmListAddress implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  facilityType = FacilityType.Pharmacy;
  FacilityType = FacilityType;
  pharmacyId: string;
  route: string;
  moreRoute: string;
  bg = '#ECDDF6';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.route = `/dashboard/onboarding/${this.facilityId}`;
      this.moreRoute = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-add-address`;
    });
  }
}
