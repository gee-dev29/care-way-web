import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Gender, ProfessionalType } from '@care-way/api';
import { FacilityType } from '@care-way/api';
import { ConversionService } from '@care-way/shared';
import { AddNewMember } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-add-lab-technician',
  imports: [AddNewMember, IonContent],
  templateUrl: './add-lab-technician.html',
  styleUrl: './add-lab-technician.css',
})
export class AddLabTechnician implements OnInit {
  public api = inject(ApiService);
  facilityType = FacilityType.BloodBank;
  public conversionService = inject(ConversionService);
  professionalType = ProfessionalType.BloodBankStaff;
  FacilityType = FacilityType;
  backRoute: any;
  genders: any = [];
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.conversionService.convert(Gender, this.genders);
    this.activatedRoute.params.subscribe((params: any) => {
      this.backRoute = `/dashboard/bbstaff`;
    });
  }
}
