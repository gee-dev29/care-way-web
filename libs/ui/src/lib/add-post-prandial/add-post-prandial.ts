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
} from '@ionic/angular/standalone';
import moment from 'moment';
import { v4 } from 'uuid';
import { TimePicker } from '../time-picker/time-picker';
import { DatePicker } from '../date-picker/date-picker';
import { ToastService } from '../toast';
import { StorageService } from '../storage-service';
import { ButtonComponent } from '../button/button.component';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'ui-add-post-prandial',
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
    TimePicker,
    DatePicker,
    ButtonComponent,
    IonIcon,
  ],
  templateUrl: './add-post-prandial.html',
  styleUrl: './add-post-prandial.css',
})
export class AddPostPrandial implements OnInit, AfterViewInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private storageService = inject(StorageService);
  private formBuilder = inject(FormBuilder);
  private toastr = inject(ToastService);
  @Input() api: any;
  @Input() vitalSignType: any;
  @Input() testingType: any;
  module: string | null;
  date = new FormControl(moment().format('YYYY-MM-DD'));
  time = new FormControl(moment().format('HH:mm'));
  recordOne = new FormControl('', [Validators.required]);
  recordTwo = new FormControl('', [Validators.required]);
  form: FormGroup;
  options: any = [];
  selectedDate = '';
  selectedTime = '';
  memberId: string | null;
  professionalId: string | null;
  appointmentId: string | null;
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
    this.route.paramMap.subscribe((params) => {
      this.module = params.get('module');
      this.memberId = params.get('memberId');
      this.appointmentId = params.get('appointmentId');
      this.professionalId = params.get('professionalId');
      this.facilityType = params.get('facilityType');
      this.facilityId = params.get('facilityId');
      this.facilityTypeId = params.get('facilityTypeId');
    });
    this.initialiseForm();
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

  initialiseForm() {
    this.form = this.formBuilder.group({
      date: this.date,
      time: this.time,
      recordOne: this.recordOne,
      recordTwo: this.recordTwo,
    });
  }

  cancel() {
    if (this.module) {
      this.router.navigateByUrl(
        '/dashboard/vitals/post-prandial/' + this.module
      );
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
              record: this.recordOne,
              testingType: this.testingType.PostPrandial,
            },
            {
              record: this.recordTwo,
              testingType: this.testingType.PostPrandial,
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
          this.toastr.show('Post-Prandial Added Successfully', 'success');
          this.cancel();
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
