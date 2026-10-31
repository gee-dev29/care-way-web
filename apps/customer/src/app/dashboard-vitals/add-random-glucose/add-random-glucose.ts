import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { AddRandom } from '@care-way/ui';
import { ApiService, VitalSignType } from '@care-way/api';
import { TestingType } from '@care-way/shared';

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
