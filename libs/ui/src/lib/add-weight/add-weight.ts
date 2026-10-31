import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
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
import { Router, ActivatedRoute } from '@angular/router';

import { v4 } from 'uuid';
import moment from 'moment';
import { DatePicker } from '../date-picker/date-picker';
import { TimePicker } from '../time-picker/time-picker';
import { StorageService } from '../storage-service';
import { ButtonComponent } from '../button/button.component';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ToastService } from '../toast';

@Component({
  selector: 'ui-add-weight',
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
    ButtonComponent,
    IonIcon,
  ],
  templateUrl: './add-weight.html',
  styleUrl: './add-weight.css',
})
export class AddWeight implements OnInit, AfterViewInit {
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

  feetValue = 5;
  decimalValue = 6;
  unitValue = 'kg';
  heightDecimalValue = 10;
  heightFeetValue = 1;
  heightUnitValue = 'm';

  feetOptions = [4, 5, 6, 7];
  decimalOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  options: Array<{ label: string; value: number }> = [];
  heightDecimalOptions: any = [];
  heightOptions: Array<{ label: string; value: number }> = [];

  date = new FormControl(moment().format('YYYY-MM-DD'));
  time = new FormControl(moment().format('HH:mm'));
  feetControl = new FormControl<number | null>(
    this.feetValue,
    Validators.required
  );
  decimalControl = new FormControl<number | null>(
    this.decimalValue,
    Validators.required
  );
  unitControl = new FormControl<string | null>(
    this.unitValue,
    Validators.required
  );
  heightFeetControl = new FormControl(
    this.heightFeetValue,
    Validators.required
  );
  heightUnitControl = new FormControl(
    this.heightUnitValue,
    Validators.required
  );
  heightDecimalControl = new FormControl(
    this.heightDecimalValue,
    Validators.required
  );

  currentValue: any;
  loading: boolean;
  form!: FormGroup;

  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.observePicker();
    }, 1000);
  }

  constructor() {
    addIcons({
      chevronBackOutline,
    });
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
    for (let i = 1; i <= 200; i++) {
      this.options.push({
        label: i.toString(),
        value: i,
      });
    }
    for (let i = 1; i <= 2; i++) {
      this.heightOptions.push({
        label: i.toString(),
        value: i,
      });
    }
    for (let i = 0; i <= 99; i++) {
      this.heightDecimalOptions.push(i);
    }
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
      this.memberId = params.memberId;
      this.appointmentId = params.appointmentId;
      this.professionalId = params.professionalId;
      this.facilityType = params.facilityType;
      this.facilityId = params.facilityId;
      this.facilityTypeId = params.facilityTypeId;
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
      heightFeet: this.heightFeetControl,
      heightDecimal: this.heightDecimalControl,
      heightUnit: this.heightUnitControl,
      date: this.date,
      time: this.time,
    });
  }

  cancel() {
    if (this.module) {
      this.router.navigateByUrl(
        '/dashboard/vitals/weight-record' + '/' + this.module
      );
      return;
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
    const { feet, decimal, date, time } = this.form.value;
    const calendarDateTime = moment(
      `${date} ${time}`,
      'YYYY-MM-DD HH:mm'
    ).utc();
    const newDate = calendarDateTime.format('YYYY-MM-DD');
    const newTime = calendarDateTime.format('HH:mm');

    const weight = Number(`${feet}.${decimal}`);
    const height = Number(
      `${this.form.value.heightFeet}.${this.form.value.heightDecimal}`
    );

    if (this.memberId) {
      this.api
        .recordMemberVital({
          memberId: this.memberId,
          vitalSign: this.vitalSignType,
          referencedDocumentId: this.appointmentId ?? null,
          body: {
            vitalRecordId: v4(),
            record: weight,
            height: height,
            date: newDate,
            time: newTime,
            referencedDocumentId: this.appointmentId ?? null,
          },
        })
        .subscribe({
          next: () => {
            this.loading = false;
            Object.keys(this.form.controls).forEach((key) => {
              this.form.get(key)?.setValue('');
            });
            this.toastr.show('Weight Added Successfully', 'success');
            setTimeout(() => {
              this.cancel();
            }, 1000);
          },
          error: () => {
            this.loading = false;
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
  onHeightFeetChange(ev: any) {
    this.heightFeetValue = ev.detail.value;
    this.form.patchValue({ heightFeet: ev.detail.value });
  }

  onHeightDecimalChange(ev: any) {
    this.heightDecimalValue = ev.detail.value;
    this.form.patchValue({ heightDecimal: ev.detail.value });
  }

  onHeightUnitChange(ev: any) {
    this.heightUnitValue = ev.detail.value;
    this.form.patchValue({ heightUnit: ev.detail.value });
  }
}
