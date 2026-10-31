import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonText,
  IonContent,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
} from '@ionic/angular/standalone';
import { InputComponent } from '../input/input';
import { Item } from '../types';
import { v4 } from 'uuid';
import moment from 'moment';
import { DatePicker } from '../date-picker/date-picker';
import { TimePicker } from '../time-picker/time-picker';
import { StorageService } from '../storage-service';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ToastService } from '../toast';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'ui-add-temperature',
  imports: [
    CommonModule,
    IonHeader,
    IonText,
    IonContent,
    InputComponent,
    ReactiveFormsModule,
    FormsModule,
    DatePicker,
    TimePicker,
    ButtonComponent,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
  ],
  templateUrl: './add-temperature.html',
  styleUrl: './add-temperature.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddTemperature implements OnInit, AfterViewInit {
  private router = inject(Router);
  private storageService = inject(StorageService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastService);

  @Input() api: any;
  @Input() vitalSignType: any;
  @Input() profileInfoService: any;
  unitValue = '°C';
  tempOptions = [35, 36, 37, 38, 39];
  decimalOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  value = 36.1;
  isCelsius = true;
  module: string | null = null;
  loading: boolean;
  // celsiusMin = 35;
  // celsiusMax = 39;
  memberId: string | null = null;
  professionalId: string | null = null;
  appointmentId: string | null = null;
  isMeasurement = false;
  feetValue = 36;
  decimalValue = 1;
  // minRange = this.celsiusMin;
  // maxRange = this.celsiusMax;

  // record = new FormControl<any>(this.value, [
  //   Validators.required,
  //   Validators.min(this.minRange),
  //   Validators.max(this.maxRange),
  // ]);
  record = new FormControl('', Validators.required);

  measurementSite = new FormControl('', Validators.required);
  date = new FormControl(moment().format('YYYY-MM-DD'));
  time = new FormControl(moment().format('HH:mm'));

  options: Item[] = [
    { text: 'Oral', value: 'Oral' },
    { text: 'Ear', value: 'Ear' },
    { text: 'Armpit', value: 'Armpit' },
    { text: 'Rectal', value: 'Rectal' },
    { text: 'Forehead', value: 'Forehead' },
  ];
  facilityType: any;
  facilityId: any;
  facilityTypeId: any;

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  form!: FormGroup;

  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.observePicker();
    }, 1000);
  }

  observePicker() {
    const pickers = document.querySelectorAll('ion-picker');

    pickers.forEach((picker: any) => {
      const pickerShadow = picker
        .querySelector('ion-picker-column')
        .shadowRoot.querySelector('.picker-opts');
      if (!pickerShadow) return;
      const columns = pickerShadow;

      const emptyItems = columns.getElementsByClassName('picker-item-empty');
      Array.from(emptyItems).forEach((el: any) => {
        el.style.display = 'none';
        el.style.height = '0';
        el.style.padding = '0';
      });
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.module = params.get('module');
      this.memberId = params.get('memberId');
      this.appointmentId = params.get('appointmentId');
      this.professionalId = params.get('professionalId');
      this.facilityId = params.get('facilityId');
      this.facilityTypeId = params.get('facilityTypeId');
      this.facilityType = params.get('facilityType');
    });

    this.storageService.user$.subscribe((user) => {
      if (this.module) {
        this.memberId = user;
      }
    });

    this.form = this.fb.group({
      record: `${this.feetValue}.${this.decimalValue}`,
      measurementSite: this.measurementSite,
      date: this.date,
      time: this.time,
    });
  }

  isMeasurementClicked() {
    this.isMeasurement = true;
  }

  offMeasurementClicked() {
    this.isMeasurement = false;
  }

  cancel() {
    if (this.module) {
      this.router.navigateByUrl(
        `/dashboard/vitals/temperature-record/${this.module}`
      );
    } else if (this.router.url.includes('nurse-dashboard')) {
      this.router.navigate([
        '/nurse-dashboard',
        this.professionalId,
        'view-appointment',
        this.appointmentId,
        this.memberId,
      ]);
    } else if (this.professionalId) {
      this.router.navigate([
        '/doctor-dashboard',
        this.professionalId,
        'view-appointment',
        this.appointmentId,
        this.memberId,
      ]);
    } else {
      this.router.navigate([
        'dashboard/view-appointment',
        this.facilityType,
        this.facilityId,
        this.facilityTypeId,
        this.appointmentId,
        this.memberId,
      ]);
    }
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    const { date, time, records, measurementSite } = this.form.value;
    const calendarDateTime = moment(
      `${date} ${time}`,
      'YYYY-MM-DD HH:mm'
    ).utc();
    const newDate = calendarDateTime.format('YYYY-MM-DD');
    const newTime = calendarDateTime.format('HH:mm');

    if (this.memberId) {
      this.api
        .recordMemberVital({
          memberId: this.memberId,
          vitalSign: this.vitalSignType,
          referencedDocumentId: this.appointmentId ?? null,
          body: {
            vitalRecordId: v4(),
            record: this.form.value.record,
            measurementSite: this.form.value.measurementSite,
            date: newDate,
            time: newTime,
            referencedDocumentId: this.appointmentId ?? null,
          },
        })
        .subscribe({
          next: () => {
            this.toastr.show('Temperature Added Successfully', 'success');
            this.loading = false;
            this.cancel();
            Object.keys(this.form.controls).forEach((key) => {
              this.form.get(key)?.setValue('');
            });
          },
          error: (err: any) => {
            this.loading = false;
            this.toastr.show('Failed to save temperature', 'error');
          },
        });
    }
  }
  onFeetChange(ev: any) {
    this.feetValue = ev.detail.value;
    this.form.setValue({
      ...this.form.value,
      record: `${this.feetValue}.${this.decimalValue}`,
    });
  }

  onDecimalChange(ev: any) {
    this.decimalValue = ev.detail.value;
    this.form.setValue({
      ...this.form.value,
      record: `${this.feetValue}.${this.decimalValue}`,
    });
  }

  onUnitChange(ev: any) {
    this.unitValue = ev.detail.value;
  }
}
