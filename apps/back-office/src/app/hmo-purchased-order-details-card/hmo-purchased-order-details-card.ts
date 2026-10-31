import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-hmo-purchased-order-details-card',
  imports: [CommonModule],
  templateUrl: './hmo-purchased-order-details-card.html',
  styleUrl: './hmo-purchased-order-details-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HmoPurchasedOrderDetailsCard {
  @Input() hmoProductOrderDetails$: Observable<any>;
  @Input() cardHeading: string;
  @Input() endDate: string;
}
