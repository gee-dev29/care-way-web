import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-hmo-product-details-card',
  imports: [CommonModule],
  templateUrl: './hmo-product-details-card.html',
  styleUrl: './hmo-product-details-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HmoProductDetailsCard {
  @Input() hmoProductDetails$: Observable<any>
  @Input() cardHeading: string
}
