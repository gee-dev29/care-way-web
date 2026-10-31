import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import moment from 'moment';

@Component({
  selector: 'ui-schedule-card',
  imports: [IonIcon],
  templateUrl: './schedule-card.html',
  styleUrl: './schedule-card.css',
})
export class ScheduleCard {
  @Input() schedule: any;
  moment=moment;
  days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
}
