import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-medical-facility-details-card',
  imports: [
    CommonModule,
  ],
  templateUrl: './medical-facility-details-card.html',
  styleUrl: './medical-facility-details-card.css',
})
export class MedicalFacilityDetailsCard {
  @Input() medicalFacility$: Observable<any>;
}
