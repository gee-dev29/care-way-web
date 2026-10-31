import { CommonModule, Location } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  ApiService,
  AppointmentType,
  MedicalAppointmentStatus,
  ProfessionalType,
} from '@healbridge/api';
import {
  PageBody,
  DesktopButton,
  Tab,
  AppointmentDetailsCard,
  Modal,
  AppointmentRequestTable,
  PageHighlight,
  InputDropDownComponent,
  ConfirmationModalDesktop,
  AppointmentRecordingCard,
} from '@healbridge/ui';
import { ToastrService } from 'ngx-toastr';
import { Table, TableModule } from 'primeng/table';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'back-office-appointment-details',
  imports: [
    PageBody,
    DesktopButton,
    Tab,
    AppointmentDetailsCard,
    Modal,
    CommonModule,
    TableModule,
    AppointmentRequestTable,
    PageHighlight,
    InputDropDownComponent,
    ConfirmationModalDesktop,
    AppointmentRecordingCard,
  ],
  templateUrl: './appointment-details.html',
  styleUrl: './appointment-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppointmentDetails implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  api = inject(ApiService);
  location = inject(Location);
  filters: object;
  appointment$: Observable<any>;
  listOfDoctors$: Observable<any>;
  appointmentRequests$: Observable<any>;
  recordingUrls$: Observable<any>;
  appointmentId: string;
  specializationId = null;
  confirmationModal = false;
  showModal = false;
  isRequest = false;
  activeTab = 0;
  totalRecords = 0;
  selected: any;
  dt1: Table;
  selectedDoctors: any[] = [];
  patientName: string;
  date: any | undefined;
  time: any | undefined;
  moment = moment;
  instruction = new FormControl('', [Validators.required]);
  tabs = [
    { title: 'Details', value: 0, content: 'Details' },
    {
      title: 'Appointment Requests',
      value: 1,
      content: 'Appointment Requests',
    },
    { title: 'Call Recordings', value: 2, content: 'Call Recordings' },
  ];
  specialization = new BehaviorSubject<any>(null);
  specializationOptions$: Observable<any>;

  constructor() {
    this.selected = new Map();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      if (params.appointmentId) {
        this.appointmentId = params.appointmentId;
        this.getAppointment(params.appointmentId);
        this.getAllAppointmentRequests(params.appointmentId);
      }
      this.getRecordings();
    });
    this.specializationOptions$ = this.api.getAvailableSpecializations();
  }

  getRecordings() {
    this.api
      .getStreamByReferencedDocumentId({
        referencedDocumentId: this.appointmentId,
      })
      .subscribe((recording: any) => {
        this.recordingUrls$ = this.api.recordingPlaylistUrls({
          streamId: recording.id,
        });
      });
  }

  filterBySpecialization(event: any) {
    this.specialization.next(event.value);
  }

  getAppointment(appointmentId: string) {
    this.appointment$ = this.api
      .getMedicalAppointment({
        appointmentId: appointmentId,
      })
      .pipe(
        tap((appointment: any) => {
          this.specializationId = appointment.specializationId;
          this.patientName = appointment.memberName;
          this.date = appointment.date;
          this.time = appointment.time;
          if (
            (appointment.status === MedicalAppointmentStatus.Pending ||
              appointment.status ===
                MedicalAppointmentStatus.AwaitingDoctorAvailability) &&
            appointment.appointmentType === AppointmentType.Virtual
          ) {
            this.isRequest = true;
          }
        })
      );
  }

  getAllAppointmentRequests(appointmentId: string) {
    this.appointmentRequests$ = this.api
      .getMedicalAppointmentRequests({ appointmentId })
      .pipe(
        tap((response: any) => {
          this.totalRecords = response.totalRecords;
        }),
        map((response) => response.data)
      );
  }

  showRequest() {
    this.showModal = true;
  }

  load(event: any) {
    this.filters = {
      ...this.filters,
      skip: event.first,
      limit: event.rows,
    };
    this.specialization.subscribe((specializationId: any) => {
      this.listOfDoctors$ = this.api
        .getMedicalProfessionals({
          specializationId,
          professionalType: ProfessionalType.Doctor,
          ...this.filters,
        })
        .pipe(
          tap((res: any) => {
            this.totalRecords = res.totalRecords;
          }),
          map((res) => res.data)
        );
    });
  }

  onRowSelect(event: any) {
    this.selected.set(event.data.professionalId, event.data.professionalId);
  }

  onRowUnselect(event: any) {
    this.selected.delete(event.data.professionalId, event.data.professionalId);
  }

  onHeaderCheckboxToggle(eventData: { $event: any; dt1: Table }) {
    if (eventData.$event.checked) {
      eventData.dt1._selection.forEach((item: any) => {
        if (item.professionalId) this.selected.set(item.professionalId, item);
      });
    } else {
      this.selected.clear();
    }
  }

  proceed() {
    this.confirmationModal = true;
  }

  selectDoctor() {
    const professionalIds = [...this.selected.values()];
    this.api
      .requestProfessionalAppointment({
        appointmentId: this.appointmentId,
        body: {
          professionalIds: professionalIds,
        },
      })
      .subscribe(() => {
        this.toastr.success('Appointment request sent successfully');
        this.confirmationModal = false;
        this.showModal = false;
        this.activeTab = 1;
        this.selected.clear();
        this.getAllAppointmentRequests(this.appointmentId);
      });
  }

  back() {
    this.location.back();
  }
}
