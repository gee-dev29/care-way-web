import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { AddOxygenSaturation as newOxygen } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-oxygen-saturation',
  imports: [newOxygen, IonContent],
  templateUrl: './add-oxygen-saturation.html',
  styleUrl: './add-oxygen-saturation.css',
})
export class AddOxygenSaturation {
  api = inject(ApiService);
  VitalSignType=VitalSignType
}
