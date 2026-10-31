import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { ProfileInfoService } from '@care-way/shared';
import { AddTemperature } from '@care-way/ui';

@Component({
  selector: 'app-vitals-add-temperature',
  imports: [AddTemperature],
  templateUrl: './vitals-add-temperature.html',
  styleUrl: './vitals-add-temperature.css',
})
export class VitalsAddTemperature {
  public api = inject(ApiService);
  vitalSignType = VitalSignType.Temperature;
  public profileInfoService = inject(ProfileInfoService);
}
