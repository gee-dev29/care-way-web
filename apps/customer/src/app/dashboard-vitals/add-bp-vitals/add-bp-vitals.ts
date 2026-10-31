import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { AddBp } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-bp-vitals',
  imports: [AddBp, IonContent],
  templateUrl: './add-bp-vitals.html',
  styleUrl: './add-bp-vitals.css',
})
export class AddBpVitals {
  public api = inject(ApiService);
  vitalSignType = VitalSignType;
}
