import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
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
import { ToastService } from '../toast';
import { StorageService } from '../storage-service';
import { ButtonComponent } from '../button/button.component';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'ui-add-random',
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
  templateUrl: './add-random.html',
  styleUrl: './add-random.css',
})
export class AddRandom implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  @Input() api: any;
  @Input() vitalSignType: any;
  @Input() testingType: any;
  private storageService = inject(StorageService);
  private formBuilder = inject(FormBuilder);
  private toastr = inject(ToastService);
  currentValue = new FormControl('', Validators.required);
  date = new FormControl(moment().format('YYYY-MM-DD'));
  time = new FormControl(moment().format('HH:mm'));
  module: string | null;
  form: FormGroup;
  selectedDate = '';
  selectedTime = '';
  options: any = [];
  memberId: string | null;
  professionalId: string | null;
  appointmentId: string | null;
  facilityType: any;
  facilityId: any;
  facilityTypeId: any;
  loading: boolean;

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     this.observePicker();
  //   }, 1000);
  // }

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
    for (let i = 1; i <= 400; i++) {
      this.options.push({
        label: i.toString(),
        value: i,
      });
    }
    this.route.paramMap.subscribe((params) => {
      this.module = params.get('module');
      this.memberId = params.get('memberId');
      this.professionalId = params.get('professionalId');
      this.appointmentId = params.get('appointmentId');
      this.facilityId = params.get('facilityId');
      this.facilityTypeId = params.get('facilityTypeId');
      this.facilityType = params.get('facilityType');
    });
    this.initializeForm();
    this.storageService.user$.subscribe((user) => {
      if (this.module) {
        this.memberId = user;
      }
    });
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      date: this.date,
      time: this.time,
      record: this.currentValue,
    });
  }

  cancel() {
    if (this.module) {
      this.router.navigate([
        '/dashboard/vitals/glucose-record/',
        this.testingType.Random,
        this.module,
      ]);
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
        vitalSign: this.vitalSignType.Glucose,
        referencedDocumentId: this.appointmentId ?? null,
        body: {
          vitalRecordId: v4(),
          date: newDate,
          time: newTime,
          referencedDocumentId: this.appointmentId ?? null,
          readings: [
            {
              testingType: this.testingType.Random,
              record: this.currentValue,
            },
          ],
        },
      })
      .subscribe({
        next: () => {
          this.loading = false;
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          this.toastr.show('Random Added Successfully', 'success');
          this.cancel();
        },
        error: () => {
          this.loading = false;
          this.toastr.show('Something went wrong', 'error');
        },
      });
  }

  onIonChange(event: CustomEvent) {
    this.currentValue = event.detail.value;
    this.form.patchValue({ record: this.currentValue });
  }
}
