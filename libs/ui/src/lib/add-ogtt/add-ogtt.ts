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
import { ToastService } from '../toast';
import { v4 } from 'uuid';
import moment from 'moment';
import { DatePicker } from '../date-picker/date-picker';
import { TimePicker } from '../time-picker/time-picker';
import { StorageService } from '../storage-service';
import { ButtonComponent } from '../button/button.component';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'ui-add-ogtt',
  imports: [
    FormsModule,
    CommonModule,
    IonHeader,
    IonText,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
    IonList,
    ReactiveFormsModule,
    DatePicker,
    TimePicker,
    ButtonComponent,
    IonIcon,
    IonContent,
  ],
  templateUrl: './add-ogtt.html',
  styleUrl: './add-ogtt.css',
})
export class AddOgtt implements OnInit, AfterViewInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private storageService = inject(StorageService);
  @Input() api: any;
  @Input() TestingType: any;
  private toastr = inject(ToastService);
  @Input() VitalSignType: any;
  private route = inject(ActivatedRoute);
  module: string | null;
  form: FormGroup;
  date = new FormControl(moment().format('YYYY-MM-DD'));
  time = new FormControl(moment().format('HH:mm'));
  timeTwo = new FormControl(new Date().toISOString(), Validators.required);
  recordOne = new FormControl('', [Validators.required]);
  recordTwo = new FormControl('', [Validators.required]);
  selectedDate = '';
  selectedTime = '';
  options: any = [];
  memberId: string;
  appointmentId: string;
  professionalId: string;
  facilityType: any;
  facilityId: any;
  facilityTypeId: any;
  loading: boolean;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.observePicker();
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
    for (let i = 1; i <= 200; i++) {
      this.options.push({
        label: i.toString(),
        value: i,
      });
    }
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
      this.memberId = params.memberId;
      this.appointmentId = params.appointmentId;
      this.professionalId = params.professionalId;
      this.facilityId = params.facilityId;
      this.facilityTypeId = params.facilityTypeId;
      this.facilityType = params.facilityType;
    });
    this.form = this.formBuilder.group({
      date: this.date,
      time: this.time,
      recordOne: this.recordOne,
      recordTwo: this.recordTwo,
    });
    this.storageService.user$.subscribe((user) => {
      if (this.module) {
        this.memberId = user;
      }
    });
  }

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }
  cancel() {
    if (this.module) {
      this.router.navigate(['/dashboard/vitals/ogtt/', this.module]);
    } else if (this.router.url.includes('nurse-dashboard')) {
      this.router.navigateByUrl(
        `nurse-dashboard/${this.professionalId}/glucose-type/${this.appointmentId}/${this.memberId}`
      );
    } else if (this.professionalId) {
      this.router.navigateByUrl(
        `doctor-dashboard/${this.professionalId}/glucose-type/${this.appointmentId}/${this.memberId}`
      );
    } else {
      this.router.navigate([
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
        vitalSign: this.VitalSignType.Glucose,
        referencedDocumentId: this.appointmentId ?? null,
        body: {
          memberId: this.memberId,
          vitalRecordId: v4(),
          readings: [
            {
              record: this.recordOne,
              testingType: this.TestingType.OGTT,
            },
            {
              record: this.recordTwo,
              testingType: this.TestingType.OGTT,
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
          this.toastr.show('Ogtt added successfully', 'success');
          if (this.module) {
            this.router.navigate(['/dashboard/vitals/ogtt/', this.module]);
            this.loading = false;
            return;
          }
          this.router.navigateByUrl('/glucose-type');
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onIonChange(event: CustomEvent) {
    this.recordOne = event.detail.value;
    this.form.patchValue({ recordOne: this.recordOne });
  }

  onIonChangeTwo(event: CustomEvent) {
    this.recordTwo = event.detail.value;
    this.form.patchValue({ recordTwo: this.recordTwo });
  }
}
