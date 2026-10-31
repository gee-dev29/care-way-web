import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { AddHeight } from '@care-way/ui';

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
