import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { TestingType } from '@healbridge/shared';
import { AddPostPrandial } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-medical-facility-add-post-prandial',
  imports: [IonContent, AddPostPrandial],
  templateUrl: './medical-facility-add-post-prandial.html',
  styleUrl: './medical-facility-add-post-prandial.css',
})
export class MedicalFacilityAddPostPrandial {
  public api = inject(ApiService);
  vitalSigntype = VitalSignType;
  testingType = TestingType;
}
