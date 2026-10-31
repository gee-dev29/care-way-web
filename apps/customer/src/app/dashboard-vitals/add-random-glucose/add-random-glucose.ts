import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { AddRandom } from '@healbridge/ui';
import { ApiService, VitalSignType } from '@healbridge/api';
import { TestingType } from '@healbridge/shared';

@Component({
  selector: 'app-add-random-glucose',
  imports: [IonContent, AddRandom],
  templateUrl: './add-random-glucose.html',
  styleUrl: './add-random-glucose.css',
})
export class AddRandomGlucose {
  public api = inject(ApiService);
  vitalSignType = VitalSignType;
  testingType = TestingType;
}
