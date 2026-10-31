import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { IonContent } from '@ionic/angular/standalone';
import { AddOxygenSaturation as newOxygen } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-medical-facility-add-oxygen-saturation',
  imports: [newOxygen, IonContent],
  templateUrl: './medical-facility-add-oxygen-saturation.html',
  styleUrl: './medical-facility-add-oxygen-saturation.css',
})
export class MedicalFacilityAddOxygenSaturation {
  api = inject(ApiService);
  VitalSignType = VitalSignType;
}
