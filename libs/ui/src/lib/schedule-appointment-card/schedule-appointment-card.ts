import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IonImg, IonAvatar, IonIcon } from '@ionic/angular/standalone';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'ui-schedule-appointment-card',
  imports: [IonImg, IonAvatar, ButtonComponent],
  templateUrl: './schedule-appointment-card.html',
  styleUrl: './schedule-appointment-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ScheduleAppointmentCard {
  @Input() name = '';
  @Input() title = '';
  @Input() date = '';
  @Input() startTime = '';
  @Input() endTime = '';
  @Input() label = '';
  @Input() buttonLabelOne = '';
  @Input() status = '';

  @Output() followUpBtn = new EventEmitter<void>();
  @Output() joinBtn = new EventEmitter<void>();
  @Output() watchBtn = new EventEmitter<void>();
  @Output() routeToBtn = new EventEmitter<void>();

  continueTwo() {
    this.followUpBtn.emit();
  }
  join() {
    this.joinBtn.emit();
  }
  watch() {
    this.watchBtn.emit();
  }

  routeTo() {
    this.routeToBtn.emit();
  }
}
