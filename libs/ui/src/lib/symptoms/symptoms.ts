import {
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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonContent,
  IonDatetime,
  IonModal,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonText,
} from '@ionic/angular/standalone';
import { ButtonComponent } from '../button/button.component';
import { InputTextarea } from '../input-textarea/input-textarea';
import { InputComponent } from '../input/input';
import { Item } from '../types';
import { DatePicker } from '../date-picker/date-picker';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { TimePicker } from '../time-picker/time-picker';
import moment from 'moment';
import { v4 } from 'uuid';
import { StorageService } from '../storage-service';

@Component({
  selector: 'ui-symptoms',
  imports: [
    IonContent,
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    InputTextarea,
    DatePicker,
    TimePicker,
    IonText,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
  ],
  templateUrl: './symptoms.html',
  styleUrl: './symptoms.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Symptoms implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private storageService = inject(StorageService);
  private formBuilder = inject(FormBuilder);
  @Input() api: any;
  @Input() vitalSign: any;
  isSymptoms = false;
  form: FormGroup;
  rangeValue = 5;
  memberId: string;

  rangeOptions: Array<{ label: string; value: number }> = [];

  dateControl = new FormControl(moment().format('YYYY-MM-DD'));
  timeControl = new FormControl(moment().format('HH:mm'));
  bodyPartControl = new FormControl('', [Validators.required]);
  rangeControl = new FormControl(this.rangeValue, [Validators.required]);
  description = new FormControl('', Validators.required);
  module: string | null;
  bodyId: string | null;
  options: Item[] = [
    {
      text: 'Hair',
      value: 'Hair',
    },
    {
      text: 'Face',
      value: 'Face',
    },
    {
      text: 'Eyes',
      value: 'Eyes',
    },
    {
      text: 'Ears',
      value: 'Ears',
    },
    {
      text: 'Nose',
      value: 'Nose',
    },
    {
      text: 'Mouth',
      value: 'Mouth',
    },
    {
      text: 'Forehead',
      value: 'Forehead',
    },
    {
      text: 'Throat',
      value: 'Throat',
    },
    {
      text: 'Nape',
      value: 'Nape',
    },
    {
      text: 'Chest',
      value: 'Chest',
    },
    {
      text: 'Abdomen',
      value: 'Abdomen',
    },
    {
      text: 'Back',
      value: 'Back',
    },
    {
      text: 'Pelvis/Waist',
      value: 'Pelvis/Waist',
    },
    {
      text: 'Genitals',
      value: 'Genitals',
    },
    {
      text: 'Shoulder',
      value: 'Shoulder',
    },
    {
      text: 'Arm (Upper arm and forearm)',
      value: 'Arm (Upper arm and forearm)',
    },
    {
      text: 'Elbow',
      value: 'Elbow',
    },
    {
      text: 'Wrist',
      value: 'Wrist',
    },
    {
      text: 'Hand (Palm, fingers, thumb, nails)',
      value: 'Hand (Palm, fingers, thumb, nails)',
    },
    {
      text: 'Hip',
      value: 'Hip',
    },
    {
      text: 'Thigh',
      value: 'Thigh',
    },
    {
      text: 'Knee',
      value: 'Knee',
    },
    {
      text: 'Leg (Shin and Calf)',
      value: 'Leg (Shin and Calf)',
    },
    {
      text: 'Ankle (Heel, sole, toes)',
      value: 'Ankle (Heel, sole, toes)',
    },
  ];
  loading: boolean;

  ngOnInit(): void {
    for (let i = 1; i <= 50; i++) {
      this.rangeOptions.push({
        label: i.toString(),
        value: i,
      });
    }
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
    });
    this.storageService.user$.subscribe((user) => {
      this.memberId = user;
    });
    this.form = this.formBuilder.group({
      bodyPart: this.bodyPartControl,
      description: this.description,
      range: this.rangeControl,
      date: this.dateControl,
      time: this.timeControl,
    });
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
    this.loading = true;
    const { description, range, date, time, bodyPart } = this.form.value;

    const vitalRecordId = v4();

    const calendarDateTime = moment(
      `${date} ${time}`,
      'YYYY-MM-DD HH:mm'
    ).utc();
    const newDate = calendarDateTime.format('YYYY-MM-DD');
    const newTime = calendarDateTime.format('HH:mm');
    this.api
      .recordMemberVital({
        memberId: this.memberId,
        vitalSign: this.vitalSign.Symptom,
        body: {
          vitalRecordId,
          durationInDays: range,
          description: description,
          bodyPart,
          date: newDate,
          time: newTime,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          if (this.module && vitalRecordId) {
            return this.router.navigateByUrl(
              `/dashboard/vitals/upload-symptoms/${vitalRecordId}/${this.module}`
            );
          }

          return this.router.navigateByUrl('/scan-symptoms');
        },
        error: (err: any) => {
          this.loading = false;
          console.error('Error recording symptoms', err);
        },
      });
  }

  onRangeChange(ev: any) {
    this.rangeValue = ev.detail.value;
    this.form.patchValue({ range: ev.detail.value });
  }

  goBack() {
    this.router.navigateByUrl(`/dashboard/vitals/symptoms/${this.module}`);
  }
}
