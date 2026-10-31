import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
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
  selector: 'medical-facility-add-pharmacist',
  imports: [CommonModule, AddNewMember, IonContent],
  templateUrl: './add-pharmacist.html',
  styleUrl: './add-pharmacist.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddPharmacist implements OnInit {
  public api = inject(ApiService);
  public conversionService = inject(ConversionService);
  professionalType = ProfessionalType.Pharmacist;
  facilityType = FacilityType.Pharmacy;
  FacilityType = FacilityType;
  backRoute: any;
  genders: any = [];
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.conversionService.convert(Gender, this.genders);
    this.activatedRoute.params.subscribe((params: any) => {
      if (params.professionalId) {
        this.backRoute = `/dashboard/pharmacist-profile/${this.facilityType}/${params.facilityId}/${params.professionalId}`;
        return;
      } else {
        this.backRoute = `/dashboard/pharms`;
      }
    });
  }
}
