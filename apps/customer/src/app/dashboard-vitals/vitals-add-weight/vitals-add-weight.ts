import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { ProfileInfoService } from '@healbridge/shared';
import { AddWeight } from '@healbridge/ui';

@Component({
  selector: 'app-vitals-add-weight',
  imports: [AddWeight],
  templateUrl: './vitals-add-weight.html',
  styleUrl: './vitals-add-weight.css',
})
export class VitalsAddWeight {
  public api = inject(ApiService);
  vitalSignType = VitalSignType.Weight;
  public profileInfoService = inject(ProfileInfoService);
}
