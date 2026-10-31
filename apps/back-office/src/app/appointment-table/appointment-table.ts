import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  input,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ApiService,
  AppointmentType,
  MedicalAppointmentStatus,
} from '@healbridge/api';
import { ConversionService } from '@healbridge/shared';
import {
  DesktopButton,
  InputDropDownComponent,
  LimitSize,
} from '@healbridge/ui';
import { TableModule } from 'primeng/table';
import moment from 'moment';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'back-office-appointment-table',
  imports: [CommonModule, TableModule, DesktopButton, InputDropDownComponent],
  templateUrl: './appointment-table.html',
  styleUrl: './appointment-table.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppointmentTable implements OnInit {
  conversion = inject(ConversionService);
  api = inject(ApiService);
  router = inject(Router);
  totalRecords = 0;
  appointments$: Observable<any>;
  members$: Observable<any>;
  statusFilter = new BehaviorSubject<any>('');
  appointmentTypeFilter = new BehaviorSubject<any>('');
  memberCategory = new BehaviorSubject<any>('');
  members: { key: string; value: string }[] = [];
  statuses: { key: string; value: string }[] = [];
  appointmentTypes: { key: string; value: string }[] = [];
  appointmentId: string;
  appointmentType = AppointmentType;
  filters: object;
  moment = moment;
  @Output() viewAppointment = new EventEmitter();
  @Input() memberId: string;
  @Input() facilityTypeId: string;
  @Input() professionalId: string;
  @Input() showPatient: boolean;
  @Input() showProfessionalName = true;

  ngOnInit(): void {
    this.conversion.convert(MedicalAppointmentStatus, this.statuses);
    this.conversion.convert(AppointmentType, this.appointmentTypes);
    this.getAllMembers();
  }

  filterByMember(event: any) {
    this.memberCategory.next(event);
  }

  filterByStatus(event: any) {
    this.statusFilter.next(event);
  }

  filterByAppointmentType(event: any) {
    this.appointmentTypeFilter.next(event);
  }

  getAllMembers() {
    this.members$ = this.api.getMembers({ limit: LimitSize.DropDown }).pipe(
      map((response: any) =>
        response.data.map((member: any) => ({
          ...member,
          memberName: `${member.firstName} ${member.lastName}`,
        }))
      )
    );
  }

  load(event: any) {
    this.memberCategory.subscribe((member) => {
      this.filters = {
        ...this.filters,
        skip: event.first,
        limit: event.rows,
        memberId: member.value,
      };
      this.getAllAppointments();
    });
    this.appointmentTypeFilter.subscribe((type) => {
      this.filters = {
        ...this.filters,
        skip: event.first,
        limit: event.rows,
        appointmentType: type?.value,
      };
      this.getAllAppointments();
    });
    this.statusFilter.subscribe((status) => {
      this.filters = {
        ...this.filters,
        skip: event.first,
        limit: event.rows,
        status: status?.value,
      };
      this.getAllAppointments();
    });
  }
  getAllAppointments() {
    this.appointments$ = this.api
      .getMedicalAppointments({
        ...this.filters,
        ...(this.memberId ? { memberId: this.memberId } : {}),
        professionalId: this.professionalId,
        facilityTypeId: this.facilityTypeId,
      })
      .pipe(
        tap((response: any) => {
          this.totalRecords = response.totalRecords;
        }),
        map((response) => response.data)
      );
  }

  view(appointmentId: string) {
    this.viewAppointment.emit(appointmentId);
  }
}
