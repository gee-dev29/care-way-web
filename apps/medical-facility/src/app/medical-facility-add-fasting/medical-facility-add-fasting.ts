import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { ProfileInfoService, TestingType } from '@healbridge/shared';
import { AddFasting } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-medical-facility-add-fasting',
  imports: [AddFasting, IonContent],
  templateUrl: './medical-facility-add-fasting.html',
  styleUrl: './medical-facility-add-fasting.css',
})
export class MedicalFacilityAddFasting {
  public api = inject(ApiService);
  vitalSignType = VitalSignType.Glucose;
  profileInfoService = inject(ProfileInfoService);
  vitalType = TestingType.Fasting;
}
