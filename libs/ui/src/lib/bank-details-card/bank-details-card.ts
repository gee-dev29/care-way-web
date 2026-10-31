import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-bank-details-card',
  imports: [
    CommonModule,
  ],
  templateUrl: './bank-details-card.html',
  styleUrl: './bank-details-card.css',
})
export class BankDetailsCard {
  @Input() facilityType: any;
  @Input() bank$: Observable<any>;
}
