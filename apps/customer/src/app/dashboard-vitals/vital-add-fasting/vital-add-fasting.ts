import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { ProfileInfoService, TestingType } from '@care-way/shared';
import { AddFasting } from '@care-way/ui';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-vital-add-fasting',
  imports: [AddFasting, IonContent],
  templateUrl: './vital-add-fasting.html',
  styleUrl: './vital-add-fasting.css',
})
export class VitalAddFasting {
  public api = inject(ApiService);
  vitalSignType = VitalSignType.Glucose;
  profileInfoService = inject(ProfileInfoService);
  vitalType = TestingType.Fasting;
}
