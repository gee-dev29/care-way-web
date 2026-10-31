import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentType } from '../models/action.model';
import { IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, receiptOutline } from 'ionicons/icons';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ui-view-appointment-card',
  imports: [CommonModule, IonSkeletonText],
  templateUrl: './view-appointment-card.html',
  styleUrl: './view-appointment-card.css',
})
export class ViewAppointmentCard implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  @Input() appointment$: Observable<any>;
  @Input() status: any;
  @Input() appointmentType: any;
  @Input() statusFn: string;
  @Input() variant: 'details' | 'list' | 'request' = 'details';
  @Output() cardClick = new EventEmitter<void>();
  @Output() joinClick = new EventEmitter<void>();
  @Output() joinCall = new EventEmitter();
  @Output() viewAppointment = new EventEmitter();
  @Output() viewRecordClick = new EventEmitter<void>();
  type = AppointmentType;
  @Input() showPatientName = true;
  @Input() showDetails = true;
  @Input() showPatient: boolean;
  @Input() showDoctor: boolean;
  moment = moment;
  module: string;

  constructor() {
    addIcons({
      documentTextOutline,
      receiptOutline,
    });
  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.module = params['module'];
    });
  }

  onJoin(event: Event) {
    event.stopPropagation();
    this.joinClick.emit();
  }

  onViewRecord(event: Event) {
    event.stopPropagation();
    this.viewRecordClick.emit();
  }

  newDateFormat(dateStr: string, time: string) {
    const dateTime = moment.utc(`${dateStr} ${time}`, 'YYYY-MM-DD HH:mm');

    return dateTime.local().format('MMMM DD, YYYY');
  }

  onJoinCall(event: Event, appointment: any) {
    event.stopPropagation();
    this.joinCall.emit(appointment);
  }

  onViewAppointment(event: Event, appointment: any) {
    event.stopPropagation();
    this.viewAppointment.emit(appointment);
  }
}
