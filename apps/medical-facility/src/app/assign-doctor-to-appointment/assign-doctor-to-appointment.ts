import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
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
  Item,
  TimePicker,
  ToastService,
} from '@healbridge/ui';
import { IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { map, Observable } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'medical-facility-assign-doctor-to-appointment',
  imports: [
    IonIcon,
    IonText,
    DatePicker,
    TimePicker,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    CommonModule,
  ],
  templateUrl: './assign-doctor-to-appointment.html',
  styleUrl: './assign-doctor-to-appointment.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AssignDoctorToAppointment implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private toastr = inject(ToastService);
  private formBuilder = inject(FormBuilder);
  date: any;
  time: any;
  @Input() type: any;
  doctors: Item[] = [];
  form: FormGroup;
  isHospital = false;
  dateControl = new FormControl(moment().format('YYYY-MM-DD'));
  timeControl = new FormControl(moment().format('HH:mm'));
  doctor = new FormControl('', Validators.required);
  memberId: string;
  hospitalId: string;
  doctors$: Observable<any>;
  selectedItem: any = [];
  isDoctor = false;
  facilityTypeId: string;
  facilityId: string;
  loading: boolean;
  facilityType: string;
  appointmentId: string;
  minDate: string;
  isNurse = false;
  professionalId = '';

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  ngOnInit(): void {
    this.isNurse = this.router.url.includes('nurse-dashboard');

    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.memberId = params.memberId;
      this.facilityTypeId = params.facilityTypeId;
      this.facilityId = params.facilityId;
      this.facilityType = params.facilityType;
      this.appointmentId = params.appointmentId;
      this.professionalId = params.professionalId;
    });
    this.form = this.formBuilder.group({
      date: this.dateControl,
      time: this.timeControl,
      doctor: this.doctor,
    });
    this.api
      .getMedicalAppointment({ appointmentId: this.appointmentId })
      .subscribe((appointment: any) => {
        this.minDate = appointment.date;
        const utcDateTime = `${appointment.date} ${appointment.time}`;

        const localDateTime = moment
          .utc(utcDateTime, 'YYYY-MM-DD HH:mm')
          .local();

        this.form.patchValue({
          ...appointment,
          date: localDateTime.format('YYYY-MM-DD'),
          time: localDateTime.format('HH:mm'),
        });
        this.getDoctors(appointment.specializationId);
      });
  }

  getDoctors(specializationId: string) {
    this.doctors$ = this.api
      .getProfessionalsInFacilityType({
        facilityTypeId: this.facilityTypeId,
      })
      .pipe(
        map((doctors: any) =>
          doctors.map((doctor: any) => ({
            text: `${doctor.firstName} ${doctor.lastName}`,
            value: doctor.professionalId,
            isChecked: false,
            ...doctor,
          }))
        )
      );
  }

  onDoctorDropdownItemSelect() {
    this.isDoctor = true;
  }

  getDoctorDropdownValue(event: any) {
    this.isDoctor = false;
  }

  goBack() {
    history.back();
  }

  assignDoctor() {
    this.loading = true;
    const { date, time } = this.form.value;

    const formattedDate = moment(date).format('YYYY-MM-DD');

    const localDateTime = moment(
      `${formattedDate} ${time}`,
      'YYYY-MM-DD HH:mm'
    );

    const utcDateTime = localDateTime.utc();
    const body = {
      professionalId: this.form.value.doctor.professionalId,
      facilityTypeId: this.facilityTypeId,
      date: utcDateTime.format('YYYY-MM-DD'),
      time: utcDateTime.format('HH:mm'),
    };
    this.api
      .confirmProfessionalAppointment({
        appointmentId: this.appointmentId,
        body,
      })
      .subscribe({
        next: () => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          this.toastr.show('Successful', 'success');
          if (this.isNurse) {
            this.router.navigate(
              ['/nurse-dashboard', this.professionalId, 'nurse-appointments'],
              { queryParams: { tab: 'Assigned' } }
            );
            return;
          }
          this.router.navigate([
            'dashboard/list-all-medical-facility-appointments',
            this.facilityType,
            this.facilityId,
            this.facilityTypeId,
            'Assigned',
          ]);
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
