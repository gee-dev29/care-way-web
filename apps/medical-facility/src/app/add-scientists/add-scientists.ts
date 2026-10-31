import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApiService,
  FacilityType,
  Gender,
  ProfessionalType,
} from '@care-way/api';
import { ConversionService } from '@care-way/shared';
import { AddNewMember } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-add-scientists',
  imports: [AddNewMember, IonContent],
  templateUrl: './add-scientists.html',
  styleUrl: './add-scientists.css',
})
export class AddScientists implements OnInit {
  public api = inject(ApiService);
  public conversionService = inject(ConversionService);
  facilityType = FacilityType.Laboratory;
  professionalType = ProfessionalType.LaboratoryStaff;
  FacilityType = FacilityType;
  backRoute: any;
  genders: any = [];
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.conversionService.convert(Gender, this.genders);
    this.activatedRoute.params.subscribe((params: any) => {
      this.backRoute = `/dashboard/labstaffs`;
    });
  }
}
