import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-ads-details-card',
  imports: [CommonModule],
  templateUrl: './ads-details-card.html',
  styleUrl: './ads-details-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdsDetailsCard {
  @Input() cardHeading: string;
  @Input() endDate: string;
  @Input() ad$: Observable<any>;
  @Output() edit = new EventEmitter<any>();
}
