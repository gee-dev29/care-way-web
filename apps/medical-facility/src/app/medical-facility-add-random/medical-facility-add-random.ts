import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { TestingType } from '@care-way/shared';
import { AddRandom } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-medical-facility-add-random',
  imports: [IonContent, AddRandom],
  templateUrl: './medical-facility-add-random.html',
  styleUrl: './medical-facility-add-random.css',
})
export class MedicalFacilityAddRandom {
  public api = inject(ApiService);
  vitalSignType = VitalSignType;
  testingType = TestingType;
}
