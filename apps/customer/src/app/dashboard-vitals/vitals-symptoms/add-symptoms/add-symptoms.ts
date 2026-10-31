import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { Symptoms } from '@care-way/ui';

@Component({
  selector: 'app-add-symptoms',
  imports: [Symptoms],
  templateUrl: './add-symptoms.html',
  styleUrl: './add-symptoms.css',
})
export class AddSymptoms {
  public api = inject(ApiService);
  public vitalSign = VitalSignType;
}
