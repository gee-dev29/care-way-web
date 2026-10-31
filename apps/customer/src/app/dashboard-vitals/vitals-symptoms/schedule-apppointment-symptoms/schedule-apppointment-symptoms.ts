import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, AppointmentType } from '@care-way/api';
import { LimitSize } from '@care-way/shared';
import {
  ButtonComponent,
  CardType,
  DatePicker,
  FacilityType,
  InputComponent,
  InputTextarea,
  Item,
  StorageService,
  TimePicker,
} from '@care-way/ui';
import {
  IonContent,
  IonIcon,
  IonLabel,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

import moment from 'moment';
import { map, Observable } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'app-schedule-apppointment-symptoms',
  imports: [
    IonContent,
    IonIcon,
    IonText,
    DatePicker,
    TimePicker,
    ReactiveFormsModule,
    InputTextarea,
    ButtonComponent,
    InputComponent,
    CardType,
    // AddressCard,
    IonLabel,
    CommonModule,
  ],
  templateUrl: './schedule-apppointment-symptoms.html',
  styleUrl: './schedule-apppointment-symptoms.css',
})
export class ScheduleApppointmentSymptoms implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private storageService = inject(StorageService);
  private formBuilder = inject(FormBuilder);
  private api = inject(ApiService);

  isSymptoms = false;
  form: FormGroup;
  type = AppointmentType;

  rangeOptions: Array<{ label: string; value: number }> = [];

  dateControl = new FormControl(moment().format('YYYY-MM-DD'));
  timeControl = new FormControl(moment().format('HH:mm'));

  specializationControl = new FormControl('', [Validators.required]);
  description = new FormControl('', Validators.required);
  hospital = new FormControl('');
  appointmentType = new FormControl('', Validators.required);

  requirePatientPayment = new FormControl<any>(true);
  addressControl = new FormControl('');

  address$: Observable<any>;
  hospitals$: Observable<any>;
  hospitalSpecializations$: Observable<any>;
  module: string | null = null;
  memberId: string;
  appointmentTypeOptions: any;
  isHospital = false;
  facilityTypeId: string;
  isSpecialization = false;
  specializationId = null;
  address = '';
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
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
    });
    this.form = this.formBuilder.group({
      notes: this.description,
      date: this.dateControl,
      time: this.timeControl,
      hospital: this.hospital,
      appointmentType: this.appointmentType,
      specialization: this.specializationControl,
      requirePatientPayment: this.requirePatientPayment,
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
    this.appointmentTypeOptions = [
      {
        text: this.type.Virtual,
        check: false,
        value: this.type.Virtual,
      },
      {
        text: this.type.Physical,
        check: false,
        value: this.type.Physical,
      },
    ];
    this.getHospitalSpecializations();
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
    const requirePatientPayment =
      this.form.value.appointmentType === this.type.Physical
        ? this.form.value.requirePatientPayment
        : true;
    const specializationId: any =
      this.specializationId === 'Not Sure' ? undefined : this.specializationId;

    const { notes, date, time } = this.form.value;
    const calendarDateTime = moment(
      `${date} ${time}`,
      'YYYY-MM-DD HH:mm'
    ).utc();
    const newDate = calendarDateTime.format('YYYY-MM-DD');
    const newTime = calendarDateTime.format('HH:mm');
    const appointmentId = v4();

    const body = {
      appointmentId,
      memberId: this.memberId,
      date: newDate,
      time: newTime,
      notes,
      specializationId,
      requirePatientPayment,
      appointmentType: this.form.value.appointmentType,
    };

    this.api
      .bookMedicalAppointment({
        appointmentId,
        body,
      })
      .subscribe({
        next: () => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          if (this.module) {
            this.router.navigateByUrl(
              `/dashboard/vitals/symptoms-summary/${appointmentId}/${this.module}`
            );
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  getHospitalSpecializations() {
    this.hospitalSpecializations$ = this.api.getAvailableSpecializations().pipe(
      map((response: any[]) => {
        const hospitalSpecializations = response.map((specialization: any) => ({
          text: specialization.name,
          value: specialization.hospitalSpecializationId,
          isChecked: false,
          ...specialization,
        }));
        return [
          {
            text: 'Not Sure',
            value: null,
            isChecked: false,
          },
          ...hospitalSpecializations,
        ];
      })
    );
  }

  onHospitalDropdownItemSelect() {
    this.isHospital = true;
  }

  getHospitalDropdownValue(event: any) {
    this.isHospital = false;
    this.getHospitalAddresses(event);
    this.facilityTypeId = event.hospitalId;
  }

  getHospitalAddresses(data: any) {
    this.api
      .getFacilityTypeById({
        facilityType: FacilityType.Hospital,
        facilityTypeId: data.hospitalId,
        facilityId: data.facilityId,
      })
      .subscribe((res: any) => {
        this.addressControl.setValue(res.address.address || '');
      });
  }

  getAppointmentType(event: any) {
    this.form.patchValue({
      appointmentType: event.value,
    });

    if (event.value === this.type.Physical) {
      this.getHospitalAddresses(this.facilityTypeId);
    }
  }
  onSpecializationDropdownItemSelect() {
    this.isSpecialization = true;
  }
  getSpecializationDropdownValue(event: any) {
    this.isSpecialization = false;
    this.specializationId = event.value;
    // this.getDoctors(event.value);
    this.getHospitals(event.value);
  }

  getHospitals(specializationId: string) {
    this.hospitals$ = this.api
      .getFacilitiesByType({
        facilityType: FacilityType.Hospital,
        limit: LimitSize.DropDown,
        specializationId,
      })
      .pipe(
        map((response: any) =>
          response.data.map((hospital: any) => ({
            text: hospital.facilityName,
            value: hospital.hospitalId,
            isChecked: false,
            ...hospital,
          }))
        )
      );
  }

  selectAddress(event: any) {
    this.address = event;
  }

  goBack() {
    this.router.navigateByUrl(`/dashboard/vitals/symptoms/${this.module}`);
  }
}
