import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-bank-details-card',
  imports: [CommonModule],
  templateUrl: './bank-details-card.html',
  styleUrl: './bank-details-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BankDetailsCard {
  @Input() cardHeading: string;
  @Input() bank$: Observable<any>;
}
