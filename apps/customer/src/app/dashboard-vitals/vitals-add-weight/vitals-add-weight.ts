import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { ProfileInfoService } from '@care-way/shared';
import { AddWeight } from '@care-way/ui';

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
