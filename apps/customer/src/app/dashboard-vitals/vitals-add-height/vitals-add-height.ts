import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { AddHeight } from '@healbridge/ui';

@Component({
  selector: 'app-vitals-add-height',
  imports: [AddHeight],
  templateUrl: './vitals-add-height.html',
  styleUrl: './vitals-add-height.css',
})
export class VitalsAddHeight {
  public api = inject(ApiService);
  vitalSignType = VitalSignType.Height;
}
