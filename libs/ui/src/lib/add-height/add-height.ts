import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonText,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonList,
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { DatetimePicker } from '../datetime-picker/datetime-picker';
import { v4 } from 'uuid';
import moment from 'moment';
import { DatePicker } from '../date-picker/date-picker';
import { TimePicker } from '../time-picker/time-picker';
import { StorageService } from '../storage-service';
import { ButtonComponent } from '../button/button.component';
import { chevronBackOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ToastService } from '../toast';

@Component({
  selector: 'ui-add-height',
  imports: [
    FormsModule,
    CommonModule,
    IonHeader,
    IonText,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
    IonList,
    DatePicker,
    TimePicker,
    IonContent,
    IonIcon,
    ButtonComponent,
  ],
  templateUrl: './add-height.html',
  styleUrl: './add-height.css',
})
export class AddHeight implements OnInit, AfterViewInit {
  private router = inject(Router);
  private storageService = inject(StorageService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastService);
  @Input() api: any;
  @Input() vitalSignType: any;
  @Input() profileInfoService: any;

  module: string | null;
  memberId: string | null = null;
  professionalId: string;
  appointmentId: string;
  facilityType: any;
  facilityId: any;
  facilityTypeId: any;

  decimalValue = 10;
  feetValue = 1;
  unitValue = 'm';
  decimalOptions: any = [];
  loading: boolean;
  currentValue: any;
  options: Array<{ label: string; value: number }> = [];

  date = new FormControl(moment().format('YYYY-MM-DD'));
  time = new FormControl(moment().format('HH:mm'));
  decimalControl = new FormControl(this.decimalValue, Validators.required);
  unitControl = new FormControl(this.unitValue, Validators.required);
  feetControl = new FormControl(this.feetValue, Validators.required);

  form!: FormGroup;

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

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

  ngOnInit() {
    for (let i = 1; i <= 2; i++) {
      this.options.push({
        label: i.toString(),
        value: i,
      });
    }
    for (let i = 0; i <= 100; i++) {
      this.decimalOptions.push(i);
    }
    this.route.params.subscribe((params) => {
      this.module = params['module'];
      this.memberId = params['memberId'];
      this.appointmentId = params['appointmentId'];
      this.professionalId = params['professionalId'];
      this.facilityType = params['facilityType'];
      this.facilityId = params['facilityId'];
      this.facilityTypeId = params['facilityTypeId'];
    });

    this.storageService.user$.subscribe((user) => {
      if (this.module) {
        this.memberId = user;
      }
    });

    this.form = this.fb.group({
      feet: this.feetControl,
      decimal: this.decimalControl,
      unit: this.unitControl,
      date: this.date,
      time: this.time,
    });
  }

  cancel() {
    if (this.module) {
      this.router.navigateByUrl(
        '/dashboard/vitals/height-record' + '/' + this.module
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
    const { date, time } = this.form.value;
    const height = `${this.form.value.feet}.${this.form.value.decimal}`;

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
            record: height,
            date: newDate,
            time: newTime,
            referencedDocumentId: this.appointmentId ?? null,
          },
        })
        .subscribe({
          next: (res: any) => {
            Object.keys(this.form.controls).forEach((key) => {
              this.form.get(key)?.setValue('');
            });
            this.loading = false;
            this.toastr.show('Height Added Successfully', 'success');
            this.cancel();
          },
          error: (err: any) => {
            this.loading = false;
            console.error('Failed to save temperature:', err);
          },
        });
    }
  }

  onFeetChange(ev: any) {
    this.feetValue = ev.detail.value;
    this.form.patchValue({ feet: ev.detail.value });
  }

  onDecimalChange(ev: any) {
    this.decimalValue = ev.detail.value;
    this.form.patchValue({ decimal: ev.detail.value });
  }

  onUnitChange(ev: any) {
    this.unitValue = ev.detail.value;
    this.form.patchValue({ unit: ev.detail.value });
  }
}
