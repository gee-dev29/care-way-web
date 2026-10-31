import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-medical-professional-details-card',
  imports: [CommonModule],
  templateUrl: './medical-professional-details-card.html',
  styleUrl: './medical-professional-details-card.css',
})
export class MedicalProfessionalDetailsCard {
  @Input() medicalProfessional$: Observable<any>;
  @Input() cardHeading: string;
}
