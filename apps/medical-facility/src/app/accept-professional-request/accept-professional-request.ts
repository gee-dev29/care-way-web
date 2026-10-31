import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import {
  ButtonComponent,
  DatePicker,
  InputComponent,
  TimePicker,
  ToastService,
  ConfirmationModalSecondary,
} from '@healbridge/ui';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { map, Observable, switchMap } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'medical-facility-accept-professional-request',
  imports: [
    IonIcon,
    IonText,
    ReactiveFormsModule,
    DatePicker,
    TimePicker,
    ButtonComponent,
    InputComponent,
    CommonModule,
    IonContent,
    ConfirmationModalSecondary,
  ],
  templateUrl: './accept-professional-request.html',
  styleUrl: './accept-professional-request.css',
})
export class AcceptProfessionalRequest implements OnInit {
  private formBuilder = inject(FormBuilder);
  private api = inject(ApiService);
  private toastr = inject(ToastService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  form: FormGroup;
  dateControl = new FormControl(moment().format('YYYY-MM-DD'));
  timeControl = new FormControl(moment().format('HH:mm'));
  hospital = new FormControl('', Validators.required);
  professionalId: string;
  appointmentId: string;
  isHospital = false;
  hospitals$: Observable<any>;
  loading: boolean;
  minDate: string;
  appointmentConfirmationModal: boolean;
  confirmationMessage: string;

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      date: this.dateControl,
      time: this.timeControl,
      hospital: this.hospital,
    });

    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.professionalId = params.professionalId;
      this.appointmentId = params.appointmentId;

      this.getAppointment(params.appointmentId);
    });
    this.getHospitals();
  }

  getAppointment(appointmentId: string) {
    this.api
      .getMedicalAppointment({ appointmentId })
      .subscribe((appointment: any) => {
        const utcDateTime = `${appointment.date} ${appointment.time}`;

        const localDateTime = moment
          .utc(utcDateTime, 'YYYY-MM-DD HH:mm')
          .local();
        const today = moment().startOf('day');
        const appointmentDate = localDateTime.clone().startOf('day');
        const resolvedDate = appointmentDate.isBefore(today)
          ? today
          : appointmentDate;

        this.form.patchValue({
          ...appointment,
          date: resolvedDate.format('YYYY-MM-DD'),
          time: localDateTime.format('HH:mm'),
        });
      });
  }

  getHospitals() {
    this.hospitals$ = this.api
      .getFacilityTypesProfessionalConnection({
        professionalId: this.professionalId,
      })
      .pipe(
        map((response: any) =>
          response.map((hospital: any) => ({
            text: hospital.facilityName,
            value: hospital.hospitalId,
            isChecked: false,
            ...hospital,
          }))
        )
      );
  }

  onHospitalDropdownItemSelect() {
    this.isHospital = true;
  }

  getHospitalDropdownValue(event: any) {
    this.isHospital = false;
  }

  closeModal() {
    this.appointmentConfirmationModal = false;
  }

  showAppointmentConfirmation() {
    this.confirmationMessage = `Are you sure you want to have this appointment on ${moment(
      this.form.value.date
    ).format('ddd MMMM D, YYYY')} at ${moment(
      this.form.value.time,
      'HH:mm'
    ).format('h:mm A')}`;
    this.appointmentConfirmationModal = true;
  }

  acceptRequest() {
    const { date, time } = this.form.value;
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const localDateTime = moment(
      `${formattedDate} ${time}`,
      'YYYY-MM-DD HH:mm'
    );
    const utcDateTime = localDateTime.utc();
    this.loading = true;
    this.api
      .updateProfessionalAppointmentRequest({
        appointmentId: this.appointmentId,
        body: {
          professionalId: this.professionalId,
          facilityTypeId: this.form.value.hospital.value,
          date: utcDateTime.format('YYYY-MM-DD'),
          time: utcDateTime.format('HH:mm'),
          status: 'Accepted',
        },
      })
      .subscribe({
        next: () => {
          this.appointmentConfirmationModal = false;
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          this.toastr.show('Successful', 'success');
          this.router.navigate([
            'doctor-dashboard',
            this.professionalId,
            'list-all-professional-appointment-requests',
          ]);
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  goBack() {
    this.router.navigate([
      'doctor-dashboard',
      this.professionalId,
      'list-all-professional-appointment-requests',
    ]);
  }
}
