import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { AddHeight } from '@care-way/ui';

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
