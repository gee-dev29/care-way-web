import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-order-details-card',
  imports: [CommonModule],
  templateUrl: './order-details-card.html',
  styleUrl: './order-details-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrderDetailsCard {
  @Input() orders$: Observable<any>;
  @Input() memberName: string;
}
