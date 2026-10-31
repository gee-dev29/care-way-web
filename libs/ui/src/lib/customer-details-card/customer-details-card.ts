import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-customer-details-card',
  imports: [CommonModule],
  templateUrl: './customer-details-card.html',
  styleUrl: './customer-details-card.css',
})
export class CustomerDetailsCard {
  @Input() customer$: Observable<any>;
  @Input() cardHeading: string;
}
