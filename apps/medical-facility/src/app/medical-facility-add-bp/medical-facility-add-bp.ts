import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { AddBp } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-medical-facility-add-bp',
  imports: [AddBp, IonContent],
  templateUrl: './medical-facility-add-bp.html',
  styleUrl: './medical-facility-add-bp.css',
})
export class MedicalFacilityAddBp {
  public api = inject(ApiService);
  vitalSignType = VitalSignType;
}
