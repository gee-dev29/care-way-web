import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { IonIcon, IonText } from '@ionic/angular/standalone';
import moment from 'moment';

@Component({
  selector: 'agency-appointment-card',
  imports: [IonText, IonIcon, CommonModule],
  templateUrl: './appointment-card.html',
  styleUrl: './appointment-card.css',
})
export class AppointmentCard {
  appointments = input<any>();
  openAppointment = output<any>();
  moment = moment;
}
