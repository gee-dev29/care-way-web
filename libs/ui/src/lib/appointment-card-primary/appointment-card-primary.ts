import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';
import moment from 'moment';
import { AppointmentType } from '../models/action.model';

@Component({
  selector: 'ui-appointment-card-primary',
  imports: [CommonModule, IonIcon],
  templateUrl: './appointment-card-primary.html',
  styleUrl: './appointment-card-primary.css',
})
export class AppointmentCardPrimary {
  @Input() appointment$: Observable<any>;
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
  @Output() viewAppointment = new EventEmitter();

  constructor() {
    addIcons({
      'chevron-forward-outline': chevronForwardOutline,
    });
  }

  onViewAppointment(event: Event, appointment: any) {
    event.stopPropagation();
    this.viewAppointment.emit(appointment);
  }
}
