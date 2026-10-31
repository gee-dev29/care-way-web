import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-patient-card-details',
  imports: [
    CommonModule,
  ],
  templateUrl: './patient-card-details.html',
  styleUrl: './patient-card-details.css',
})
export class PatientCardDetails {
  @Input() facilityType: any;
  @Input() patientCardType$: Observable<any>;
}
