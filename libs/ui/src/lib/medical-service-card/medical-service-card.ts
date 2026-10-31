import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalProduct } from '@care-way/api';

@Component({
  selector: 'ui-medical-service-card',
  imports: [CommonModule],
  templateUrl: './medical-service-card.html',
  styleUrl: './medical-service-card.css',
})
export class MedicalServiceCard {
  @Input() service: MedicalProduct;
}
