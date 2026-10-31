import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'ui-appointment-details-card',
  imports: [CommonModule],
  templateUrl: './appointment-details-card.html',
  styleUrl: './appointment-details-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppointmentDetailsCard {
  @Input() appointment$: Observable<any>;
  @Input() cardHeading: string;
  moment = moment;
}
