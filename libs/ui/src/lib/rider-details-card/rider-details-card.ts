import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-rider-details-card',
  imports: [CommonModule],
  templateUrl: './rider-details-card.html',
  styleUrl: './rider-details-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RiderDetailsCard {
  @Input() details$: Observable<any>;
  @Input() totalRecords = 0;
  @Input() cardHeading: string;
}
