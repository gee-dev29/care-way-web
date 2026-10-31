import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { TestingType } from '@healbridge/shared';
import { AddOgtt } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-medical-facility-add-ogtt',
  imports: [IonContent, AddOgtt],
  templateUrl: './medical-facility-add-ogtt.html',
  styleUrl: './medical-facility-add-ogtt.css',
})
export class MedicalFacilityAddOgtt {
  api = inject(ApiService);
  VitalSignType = VitalSignType;
  TestingType = TestingType;
}
