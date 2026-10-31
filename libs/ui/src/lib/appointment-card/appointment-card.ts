import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { AppointmentType } from '../models/action.model';

@Component({
  selector: 'ui-appointment-card',
  imports: [IonIcon, CommonModule, IonSkeletonText],
  templateUrl: './appointment-card.html',
  styleUrl: './appointment-card.css',
})
export class AppointmentCard {
  @Input() appointment: any;
  @Input() status: any;
  @Input() appointmentType: any;
  @Input() statusFn: string;
  @Input() variant: 'details' | 'list' | 'request' = 'details';
  @Output() payClick = new EventEmitter<string>();
  @Output() cardClick = new EventEmitter<void>();
  @Output() joinClick = new EventEmitter<void>();
  @Output() joinCall = new EventEmitter();
  @Output() viewAppointment = new EventEmitter();
  @Output() viewRecordClick = new EventEmitter<void>();
  @Output() assignDoctorClick = new EventEmitter<any>();
  @Output() declineRequestClick = new EventEmitter<any>();
  type = AppointmentType;
  @Input() showPatientName = true;
  @Input() showDetails = true;
  userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  onPay(event: Event, id: string) {
    event.stopPropagation();
    this.payClick.emit(id);
  }

  onCardClick() {
    this.cardClick.emit();
  }

  onJoin(event: Event) {
    event.stopPropagation();
    this.joinClick.emit();
  }

  onViewRecord(event: Event) {
    event.stopPropagation();
    this.viewRecordClick.emit();
  }

  onJoinCall(event: Event, appointment: any) {
    event.stopPropagation();
    this.joinCall.emit(appointment);
  }

  onViewAppointment(event: Event, appointment: any) {
    event.stopPropagation();
    this.viewAppointment.emit(appointment);
  }

  onAssignDoctor(event: Event, appointment: any) {
    event.stopPropagation();
    this.assignDoctorClick.emit(appointment);
  }

  onDeclineRequest(event: Event, appointment: any) {
    event.stopPropagation();
    this.declineRequestClick.emit(appointment);
  }
}
