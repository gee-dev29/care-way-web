import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-withdrawal-details-card',
  imports: [CommonModule],
  templateUrl: './withdrawal-details-card.html',
  styleUrl: './withdrawal-details-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WithdrawalDetailsCard {
  @Input() cardHeading: string;
  @Input() withdrawal$: Observable<any>;
  moment = moment;
}
