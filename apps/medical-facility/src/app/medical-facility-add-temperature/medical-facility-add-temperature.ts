import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { ProfileInfoService } from '@care-way/shared';
import { AddTemperature } from '@care-way/ui';

@Component({
  selector: 'medical-facility-medical-facility-add-temperature',
  imports: [AddTemperature],
  templateUrl: './medical-facility-add-temperature.html',
  styleUrl: './medical-facility-add-temperature.css',
})
export class MedicalFacilityAddTemperature {
  public api = inject(ApiService);
  vitalSignType = VitalSignType.Temperature;
  public profileInfoService = inject(ProfileInfoService);
}
