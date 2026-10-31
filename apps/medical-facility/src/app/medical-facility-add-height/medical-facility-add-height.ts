import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { AddHeight } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-medical-facility-add-height',
  imports: [AddHeight],
  templateUrl: './medical-facility-add-height.html',
  styleUrl: './medical-facility-add-height.css',
})
export class MedicalFacilityAddHeight {
  public api = inject(ApiService);
  vitalSignType = VitalSignType.Height;
}
