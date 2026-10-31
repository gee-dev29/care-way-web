import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { Symptoms } from '@healbridge/ui';

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
