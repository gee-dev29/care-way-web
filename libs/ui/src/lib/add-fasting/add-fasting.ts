import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
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
  IonIcon,
  IonContent,
} from '@ionic/angular/standalone';
import moment from 'moment';
import { v4 } from 'uuid';
import { DatePicker } from '../date-picker/date-picker';
import { TimePicker } from '../time-picker/time-picker';
import { StorageService } from '../storage-service';
import { ButtonComponent } from '../button/button.component';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ToastService } from '../toast';
@Component({
  selector: 'ui-add-fasting',
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
    ButtonComponent,
    IonIcon,
    IonContent,
  ],
  templateUrl: './add-fasting.html',
  styleUrl: './add-fasting.css',
})
export class AddFasting implements OnInit, AfterViewInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private storageService = inject(StorageService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastService);
  @Input() api: any;
  @Input() vitalSignType: any;
  @Input() profileInfoService: any;
  @Input() fasting: any;
  form!: FormGroup;
  decimalValue = 40;
  module: string | null;
  memberId: string | null = null;
  professionalId: string;
  appointmentId: string;

  currentValue: any;
  options: Array<{ label: string; value: number }> = [];
  date = new FormControl(moment().format('YYYY-MM-DD'));
  time = new FormControl(moment().format('HH:mm'));
  decimalControl = new FormControl<number | null>(
    this.decimalValue,
    Validators.required
  );
  facilityType: any;
  facilityId: any;
  facilityTypeId: any;
  loading: boolean;

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
    for (let i = 1; i <= 300; i++) {
      this.options.push({
        label: i.toString(),
        value: i,
      });
    }
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
      this.memberId = params.memberId;
      this.professionalId = params.professionalId;
      this.appointmentId = params.appointmentId;
      this.facilityId = params.facilityId;
      this.facilityTypeId = params.facilityTypeId;
      this.facilityType = params.facilityType;
    });

    this.storageService?.user$.subscribe((user) => {
      if (this.module) {
        this.memberId = user;
      }
    });

    this.form = this.fb.group({
      decimal: this.decimalControl,
      date: this.date,
      time: this.time,
    });
  }

  cancel() {
    if (this.module) {
      return this.router.navigateByUrl(
        `/dashboard/vitals/glucose-record/${this.fasting}/${this.module}`
      );
    }
    if (this.router.url.includes('nurse-dashboard')) {
      return this.router.navigateByUrl(
        `nurse-dashboard/${this.professionalId}/glucose-type/${this.appointmentId}/${this.memberId}`
      );
    }
    if (this.professionalId) {
      return this.router.navigateByUrl(
        `doctor-dashboard/${this.professionalId}/glucose-type/${this.appointmentId}/${this.memberId}`
      );
    } else {
      return this.router.navigate([
        'dashboard/glucose-type',
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

    const { decimal, date, time } = this.form.value;

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
          referencedDocumentId: this.appointmentId ?? null,
          vitalSign: this.vitalSignType,
          body: {
            vitalRecordId: v4(),
            readings: [
              {
                record: decimal,
                testingType: this.fasting,
              },
            ],
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
            this.toastr.show('Fasting Added Successfully', 'success');
            this.cancel();
          },
          error: () => {
            this.loading = false;
            this.toastr.show('Failed to add fasting', 'error');
          },
        });
    }
  }

  onIonChange(event: CustomEvent) {
    this.decimalValue = event.detail.value;
    this.form.patchValue({ decimal: event.detail.value });
  }
}
