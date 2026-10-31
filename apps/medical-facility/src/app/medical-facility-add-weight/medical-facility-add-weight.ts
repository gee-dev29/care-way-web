import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { ProfileInfoService } from '@healbridge/shared';
import { AddWeight } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-medical-facility-add-weight',
  imports: [AddWeight],
  templateUrl: './medical-facility-add-weight.html',
  styleUrl: './medical-facility-add-weight.css',
})
export class MedicalFacilityAddWeight {
  public api = inject(ApiService);
  vitalSignType = VitalSignType.Weight;
  public profileInfoService = inject(ProfileInfoService);
}
