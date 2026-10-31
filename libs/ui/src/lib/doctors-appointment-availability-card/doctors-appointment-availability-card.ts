import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppointmentType } from '../models/action.model';
import { Observable } from 'rxjs';
import moment from 'moment';
import { IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'ui-doctors-appointment-availability-card',
  imports: [CommonModule, IonIcon],
  templateUrl: './doctors-appointment-availability-card.html',
  styleUrl: './doctors-appointment-availability-card.css',
})
export class DoctorsAppointmentAvailabilityCard {
  @Input() appointment: any;
  @Input() statusFn: string;
  @Input() status: any;
  @Input() background: any;
  @Input() showHeading: boolean;
  @Input() showDoctor: boolean;
  @Input() showPatient: boolean;
  @Output() view = new EventEmitter();
  @Output() viewAll = new EventEmitter();
  moment = moment;
  userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  type = AppointmentType;
  @Output() selectAppointment = new EventEmitter();

  constructor() {
    addIcons({
      'chevron-forward-outline': chevronForwardOutline,
    });
  }

  onSelectAppointment(event: Event, appointment: any) {
    event.stopPropagation();
    this.selectAppointment.emit(appointment);
  }
}
