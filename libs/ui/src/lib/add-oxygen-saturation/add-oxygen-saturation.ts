import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonText,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonList,
  IonHeader,
  IonIcon,
} from '@ionic/angular/standalone';
import moment from 'moment';
import { v4 } from 'uuid';
import { ToastService } from '../toast';
import { DatePicker } from '../date-picker/date-picker';
import { TimePicker } from '../time-picker/time-picker';
import { StorageService } from '../storage-service';
import { ButtonComponent } from '../button/button.component';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'ui-add-oxygen-saturation',
  imports: [
    FormsModule,
    CommonModule,
    IonText,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
    ReactiveFormsModule,
    DatePicker,
    TimePicker,
    ButtonComponent,
    IonList,
    IonHeader,
    IonIcon,
  ],
  templateUrl: './add-oxygen-saturation.html',
  styleUrl: './add-oxygen-saturation.css',
})
export class AddOxygenSaturation implements OnInit, AfterViewInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private storageService = inject(StorageService);
  @Input() api: any;
  private toastr = inject(ToastService);
  @Input() VitalSignType: any;
  private route = inject(ActivatedRoute);
  module: string | null;
  isCm = false;
  currentValue = 98;
  currentPulse = 60;
  options: any = [];
  spo: any = this.buildNumberCounts('spo');
  pulse: any = this.buildNumberCounts('pulse');
  memberId: string;
  form: FormGroup;
  date = new FormControl(moment().format('YYYY-MM-DD'));
  time = new FormControl(moment().format('HH:mm'));
  selectedDate = '';
  selectedTime = '';
  professionalId: string;
  appointmentId: string;
  facilityType: string;
  facilityId: string;
  facilityTypeId: string;
  loading: boolean;

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
      if (this.module != 'Customer') {
        this.memberId = params.memberId;
        this.appointmentId = params.appointmentId;
        this.professionalId = params.professionalId;
        this.facilityType = params.facilityType;
        this.facilityId = params.facilityId;
        this.facilityTypeId = params.facilityTypeId;
      }
    });
    this.form = this.formBuilder.group({
      date: this.date,
      time: this.time,
    });
    this.storageService.user$.subscribe((user) => {
      if (this.module) {
        this.memberId = user;
      }
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

  buildNumberCounts(what: any) {
    this.options = [];
    if (what === 'spo') {
      for (let i = 0; i <= 100; i++) {
        this.options.push({
          label: i.toString(),
          value: i,
        });
      }
    } else {
      for (let i = 1; i <= 100; i++) {
        this.options.push({
          label: i.toString(),
          value: i,
        });
      }
    }
    return this.options;
  }

  cancel() {
    if (this.module) {
      this.router.navigateByUrl(
        '/dashboard/vitals/oxygen-saturation-record/' + this.module
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
    const dateValue = this.date.value;
    const timeValue = this.time.value;
    if (!dateValue || !timeValue) {
      throw new Error('DateTime is required');
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
        vitalSign: this.VitalSignType.OxygenSaturation,
        referencedDocumentId: this.appointmentId ?? null,
        body: {
          memberId: this.memberId,
          vitalRecordId: v4(),
          record: this.currentValue,
          date: newDate,
          time: newTime,
          referencedDocumentId: this.appointmentId ?? null,
        },
      })
      .subscribe(() => {
        this.api
          .recordMemberVital({
            memberId: this.memberId,
            vitalSign: this.VitalSignType.Pulse,
            referencedDocumentId: this.appointmentId ?? null,
            body: {
              memberId: this.memberId,
              vitalRecordId: v4(),
              record: this.currentPulse,
              date: this.form.value.date,
              time: this.form.value.time,
              referencedDocumentId: this.appointmentId ?? null,
            },
          })
          .subscribe({
            next: () => {
              this.loading = false;
              Object.keys(this.form.controls).forEach((key) => {
                this.form.get(key)?.setValue('');
              });
              this.toastr.show(
                'Oxygen Saturation & Pulse added successfully',
                'success'
              );
              this.cancel();
            },
            error: () => {
              this.loading = false;
            },
          });
      });
  }

  onIonChange(event: CustomEvent) {
    this.currentValue = event.detail.value;
  }
  onPulseChange(event: CustomEvent) {
    this.currentPulse = event.detail.value;
  }
}
