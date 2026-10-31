import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonText,
  IonContent,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonImg,
  IonIcon,
} from '@ionic/angular/standalone';
import { v4 } from 'uuid';
import moment from 'moment';
import { DatePicker } from '../date-picker/date-picker';
import { TimePicker } from '../time-picker/time-picker';
import { ToastService } from '../toast';
import { StorageService } from '../storage-service';
import { ButtonComponent } from '../button/button.component';
import { chevronBackOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'ui-add-bp',
  imports: [
    CommonModule,
    IonText,
    IonContent,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
    ReactiveFormsModule,
    DatePicker,
    TimePicker,
    IonImg,
    ButtonComponent,
    IonIcon,
  ],
  templateUrl: './add-bp.html',
  styleUrl: './add-bp.css',
})
export class AddBp implements OnInit, AfterViewInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private storageService = inject(StorageService);
  @Input() api: any;
  @Input() vitalSignType: any;
  public formBuilder = inject(FormBuilder);
  private toastr = inject(ToastService);
  form: FormGroup;
  currentSystolic = 40;
  currentDiastolic = 70;
  value = 1;
  isCm = false;
  options: any = [];
  systolicOptions: any = this.buildNumberCounts('systolic');
  diastolicOptions: any = this.buildNumberCounts('diastolic');
  professionalId: string;
  appointmentId: string;
  memberId: string;
  module: string | null;
  loading: boolean;
  date = new FormControl(moment().format('YYYY-MM-DD'));
  time = new FormControl(moment().format('HH:mm'));
  systolic = new FormControl(100, [Validators.required]);
  diastolic = new FormControl(100, [Validators.required]);
  facilityType: string;
  facilityId: string;
  facilityTypeId: string;

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
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
    });
    this.form = this.formBuilder.group({
      date: this.date,
      time: this.time,
      systolic: this.systolic,
      diastolic: this.diastolic,
    });
    this.storageService.user$.subscribe((user) => {
      this.memberId = user;
    });
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
      if (this.module != 'Customer') {
        this.memberId = params.memberId;
        this.appointmentId = params.appointmentId;
        this.professionalId = params.professionalId;
        this.facilityId = params.facilityId;
        this.facilityTypeId = params.facilityTypeId;
        this.facilityType = params.facilityType;
      }
    });
  }

  buildNumberCounts(what: any) {
    this.options = [];
    if (what === 'systolic') {
      for (let i = 1; i <= 250; i++) {
        this.options.push({
          label: i.toString(),
          value: i,
        });
      }
    } else {
      for (let i = 1; i <= 140; i++) {
        this.options.push({
          label: i.toString(),
          value: i,
        });
      }
    }
    return this.options;
  }

  goToVitals() {
    if (this.module) {
      this.router.navigateByUrl(
        '/dashboard/vitals/blood-pressure-record' + '/' + this.module
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
    const calendarDateTime = moment(
      `${date} ${time}`,
      'YYYY-MM-DD HH:mm'
    ).utc();
    const newDate = calendarDateTime.format('YYYY-MM-DD');
    const newTime = calendarDateTime.format('HH:mm');

    this.api
      .recordMemberVital({
        memberId: this.memberId,
        vitalSign: this.vitalSignType.BloodPressure,
        referencedDocumentId: this.appointmentId ?? null,
        body: {
          memberId: this.memberId,
          vitalRecordId: v4(),
          systolic: this.currentSystolic,
          diastolic: this.currentDiastolic,
          date: newDate,
          time: newTime,
          referencedDocumentId: this.appointmentId ?? null,
        },
      })
      .subscribe({
        next: () => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          this.currentSystolic = 40;
          this.currentDiastolic = 70;
          this.loading = false;
          this.toastr.show('Blood Pressure Added Successfully', 'success');
          this.goToVitals();
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onSystolicChange(event: CustomEvent) {
    this.currentSystolic = event.detail.value;
    this.form.patchValue({ systolic: this.currentSystolic });
  }

  onDiastolicChange(event: CustomEvent) {
    this.currentDiastolic = event.detail.value;
    this.form.patchValue({ diastolic: this.currentDiastolic });
  }
}
