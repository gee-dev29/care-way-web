import { CommonModule, Location } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
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
import { Router } from '@angular/router';
import { ConversionService } from '@care-way/shared';
import {
  InputCalendar,
  InputComponent,
  InputTextarea,
  ButtonComponent,
} from '@care-way/ui';
import {
  IonContent,
  IonModal,
  IonIcon,
  IonPicker,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  chevronBackOutline,
  chevronUpOutline,
  pencilOutline,
  removeCircleOutline,
} from 'ionicons/icons';
import moment from 'moment';

@Component({
  selector: 'app-create-reminder',
  imports: [
    IonContent,
    CommonModule,
    InputComponent,
    InputCalendar,
    InputTextarea,
    ReactiveFormsModule,
    FormsModule,
    IonModal,
    IonIcon,
    IonPicker,
    ButtonComponent,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
  ],
  templateUrl: './create-reminder.html',
  styleUrl: './create-reminder.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreateReminder implements OnInit {
  private location = inject(Location);
  private formBuilder = inject(FormBuilder);
  private conversion = inject(ConversionService);
  private router = inject(Router);
  private editingTimeIndex: number | null = null;

  loading = false;
  isFrequency = false;
  form: FormGroup;

  medicationName = new FormControl('', [Validators.required]);
  strength = new FormControl('', [Validators.required]);
  dosage = new FormControl('', [Validators.required]);
  frequency = new FormControl('Daily', [
    Validators.required,
  ]);
  time = new FormControl('', [Validators.required]);
  note = new FormControl('', [Validators.required]);
  startDate = new FormControl('', [Validators.required]);
  endDate = new FormControl('', [Validators.required]);
  selectedDay=0;
  days = [
    { text: 'S', value: 'Sunday' },
    { text: 'M', value: 'Monday' },
    { text: 'T', value: 'Tuesday' },
    { text: 'W', value: 'Wednesday' },
    { text: 'T', value: 'Thursday' },
    { text: 'F', value: 'Friday' },
    { text: 'S', value: 'Saturday' },
  ];
  times: { time: string; unit: number }[] = [];
  isTimeModalOpen = false;
  selectedTime = '';
  isUnitModalOpen = false;
  editingUnitIndex: number | null = null;
  pendingUnit = 1;
  isUnitPickerOpen = false;
  unitPickerIndex: number | null = null;

  frequencyTypes = [
    { text: 'Daily', value: 'Daily' },
    { text: 'Cycle-Based Schedule', value: 'Cycle-Based Schedule' },
    { text: 'Selected Days of the Week', value: 'Selected Days of the Week' },
    { text: 'At Regular Intervals', value: 'At Regular Intervals' },
    { text: 'As Needed', value: 'As Needed' },
  ];

  unitOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  selectedFrequency = '';

  constructor() {
    addIcons({
      removeCircleOutline,
      addCircleOutline,
      pencilOutline,
      chevronUpOutline,
      'chevron-back-outline': chevronBackOutline,
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      medicationName: this.medicationName,
      strength: this.strength,
      dosage: this.dosage,
      frequency: this.frequency,
      time: this.time,
      note: this.note,
      startDate: this.startDate,
      endDate: this.endDate,
    });
  }

  goBack() {
    this.router.navigateByUrl('dashboard/home');
  }

  isFrequencyClicked() {
    this.isFrequency = true;
  }

  offFrequencyClicked() {
    this.isFrequency = false;
  }

  addTime() {
    this.editingTimeIndex = null;
    this.isTimeModalOpen = true;
    this.selectedTime = moment().format('YYYY-MM-DDTHH:mm:ss');
  }


  openTimePicker(index: number) {
    this.editingTimeIndex = index;
    const current = this.times[index]?.time;
    this.selectedTime = current
      ? moment(current, 'hh:mm A').format('YYYY-MM-DDTHH:mm:ss')
      : moment().format('YYYY-MM-DDTHH:mm:ss');
    this.isTimeModalOpen = true;
  }

  unitPickerColumns = [
    {
      name: 'unit',
      options: Array.from({ length: 10 }, (_, i) => ({
        text: String(i + 1),
        value: i + 1,
      })),
    },
  ];

  unitPickerButtons = [
    { text: 'Cancel', role: 'cancel' },
    {
      text: 'Confirm',
      handler: (value: any) => {
        const selected = value?.unit?.value;
        if (this.unitPickerIndex !== null && selected) {
          this.times[this.unitPickerIndex].unit = selected;
        }
        this.unitPickerIndex = null;
      },
    },
  ];

  onDateTimeChange(time: any) {
    this.selectedTime = time;
  }

  confirmTime() {
    const formatted = moment(this.selectedTime).format('hh:mm A');
    if (this.editingTimeIndex !== null) {
      this.times[this.editingTimeIndex].time = formatted;
    } else {
      this.times.push({ time: formatted, unit: 1 });
    }
    this.isTimeModalOpen = false;
    this.editingTimeIndex = null;
  }

  onTimeModalDismiss() {
    this.isTimeModalOpen = false;
    this.editingTimeIndex = null;
  }

  removeTime(index: number) {
    this.times.splice(index, 1);
  }

  openUnitPicker(index: number) {
    this.unitPickerIndex = index;
    this.isUnitPickerOpen = true;
  }

  confirmUnit(value: any) {
    if (this.unitPickerIndex !== null) {
      this.times[this.unitPickerIndex].unit = value;
    }
    this.isUnitPickerOpen = false;
    this.unitPickerIndex = null;
  }

  onUnitModalDismiss() {
    this.isUnitModalOpen = false;
    this.editingUnitIndex = null;
  }

  setStartDate(date: Date) {
    this.startDate.setValue(moment(date).format('YYYY-MM-DD'));
  }

  setEndDate(date: Date) {
    this.endDate.setValue(moment(date).format('YYYY-MM-DD'));
  }

  cancel() {
    this.location.back();
    this.form.reset();
  }

  generateRandomColor(): string {
    const letters = '0123456789ABCDE';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  save() {
    const reminder: any = {
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
      times: this.times,
      meds: [
        {
          medicationName: this.form.value?.medicationName,
          dosage: this.form.value?.dosage,
          color: this.generateRandomColor(),
        },
      ],
    };
    const stored = localStorage.getItem('reminders');
    const reminders = stored ? JSON.parse(stored) : [];
    reminders.push(reminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));

    this.form.reset();
    this.times = [];
    this.selectedFrequency = '';
    this.router.navigateByUrl('/dashboard/reminder-details');
  }

  selectDay(day:any){
    //
  }
}
