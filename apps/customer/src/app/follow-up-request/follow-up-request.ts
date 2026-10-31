import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, AppointmentType } from '@care-way/api';
import {
  AppointmentForm,
  ButtonComponent,
  DatePicker,
  InputTextarea,
  Item,
  StorageService,
  TimePicker,
  ToastService,
} from '@care-way/ui';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import moment from 'moment';
import { v4 } from 'uuid';

@Component({
  selector: 'app-follow-up-request',
  imports: [
    IonContent,
    IonIcon,
    IonText,
    DatePicker,
    TimePicker,
    ReactiveFormsModule,
    InputTextarea,
    ButtonComponent,
  ],
  templateUrl: './follow-up-request.html',
  styleUrl: './follow-up-request.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FollowUpRequest implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private storageService = inject(StorageService);
  private toast = inject(ToastService);
  private formBuilder = inject(FormBuilder);
  private api = inject(ApiService);

  isSymptoms = false;
  form: FormGroup;

  rangeOptions: Array<{ label: string; value: number }> = [];

  dateControl = new FormControl(moment().format('YYYY-MM-DD'));
  timeControl = new FormControl(moment().format('HH:mm'));
  specializationControl = new FormControl('', [Validators.required]);
  description = new FormControl('', Validators.required);
  memberId: string;
  options: Item[] = [
    {
      text: 'Cardiologist',
      value: 'Cardiologist',
    },
    {
      text: 'Dermatologist',
      value: 'Dermatologist',
    },
    {
      text: 'Radiologist',
      value: 'Radiologist',
    },
    {
      text: 'ENT Specialist',
      value: 'ENT Specialist',
    },
  ];

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      // specialization: this.specializationControl,
      notes: this.description,
      date: this.dateControl,
      time: this.timeControl,
    });
    for (let i = 1; i <= 100; i++) {
      this.rangeOptions.push({
        label: i.toString(),
        value: i,
      });
    }
    this.storageService.user$.subscribe((user) => {
      this.memberId = user;
    });
  }

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }
  isSymptomsClicked() {
    this.isSymptoms = true;
  }
  offSymptomsClicked() {
    this.isSymptoms = false;
  }

  continue() {
    if (this.form.invalid) {
      this.toast.show('Please fill all required fields', 'error');
      return;
    }

    const { notes, date, time } = this.form.value;
    const calendarDateTime = moment(
      `${date} ${time}`,
      'YYYY-MM-DD HH:mm'
    ).utc();
    const newDate = calendarDateTime.format('YYYY-MM-DD');
    const newTime = calendarDateTime.format('HH:mm');

    const appointmentId = v4();
    this.api
      .bookMedicalAppointment({
        appointmentId,
        body: {
          appointmentId,
          memberId: this.memberId,
          date: newDate,
          time: newTime,
          notes,
          appointmentType: AppointmentType.Virtual,
        },
      })
      .subscribe({
        next: () => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          this.router.navigateByUrl(
            `/dashboard/payment-summary/${appointmentId}`
          );
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/appointments');
  }
}
