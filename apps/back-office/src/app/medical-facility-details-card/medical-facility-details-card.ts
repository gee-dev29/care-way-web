import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-medical-facility-details-card',
  imports: [CommonModule],
  templateUrl: './medical-facility-details-card.html',
  styleUrl: './medical-facility-details-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MedicalFacilityDetailsCard {
  @Input() medicalFacility$: Observable<any>;
  @Input() cardHeading: string;

  getSpecNames(list: any[]) {
    return list
      .map((specialization) => specialization.name || specialization)
      .join(', ');
  }
  getProductCategory(list: any[]) {
    return list.map((productCategory) => productCategory).join(', ');
  }
  getBloodProducts(list: any[]) {
    return list.map((bloodProducts) => bloodProducts).join(', ');
  }
}
