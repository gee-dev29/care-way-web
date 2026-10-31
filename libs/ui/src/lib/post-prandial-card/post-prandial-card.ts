import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonCard, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, timeOutline } from 'ionicons/icons';
import moment from 'moment';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-post-prandial-card',
  imports: [IonCard, IonIcon, CommonModule],
  templateUrl: './post-prandial-card.html',
  styleUrl: './post-prandial-card.css',
})
export class PostPrandialCard {
  @Input() value!: number;
  @Input() date!: string;
  @Input() time!: string;
  @Input() status!: string;
  @Input() postPrandial$: Observable<any>;

  constructor() {
    addIcons({
      'calendar-outline': calendarOutline,
      'time-outline': timeOutline,
    });
  }
  newDateFormat(dateStr: string) {
    return moment.utc(dateStr).local().fromNow();
  }

  getPostprandialColor(status: string) {
    switch (status) {
      case 'Low':
        return 'status-low';
      case 'Normal':
        return 'status-normal';
      case 'Pre-diabetic':
        return 'status-pre-diabetic';
      case 'Diabetic':
        return 'status-diabetic';
      default:
        return 'status-default';
    }
  }
}
