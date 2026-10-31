import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApiService,
  FacilityType,
  Gender,
  ProfessionalType,
} from '@healbridge/api';
import { ConversionService } from '@healbridge/shared';
import { AddNewMember } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-add-radiologist',
  imports: [AddNewMember, IonContent],
  templateUrl: './add-radiologist.html',
  styleUrl: './add-radiologist.css',
})
export class AddRadiologist implements OnInit {
  public api = inject(ApiService);
  public conversionService = inject(ConversionService);
  facilityType = FacilityType.Radiology;
  professionalType = ProfessionalType.RadiologyStaff;
  FacilityType = FacilityType;
  backRoute: any;
  genders: any = [];
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.conversionService.convert(Gender, this.genders);
    this.activatedRoute.params.subscribe((params: any) => {
      this.backRoute = `/dashboard/radiologystaff`;
    });
  }
}
