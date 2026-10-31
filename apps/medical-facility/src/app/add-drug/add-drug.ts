/* eslint-disable no-irregular-whitespace */
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, GreenBookType, ReferralType } from '@healbridge/api';
import { ConversionService, Frequency } from '@healbridge/shared';
import { ButtonComponent, InputComponent, Item } from '@healbridge/ui';
import {
  IonContent,
  IonIcon,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonRadio,
  IonText,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonDatetime,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import moment from 'moment';
import {
  addCircleOutline,
  chevronBackOutline,
  chevronUpOutline,
  pencilOutline,
  removeCircleOutline,
} from 'ionicons/icons';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-add-drug',
  imports: [
    CommonModule,
    IonIcon,
    IonText,
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    FormsModule,
    IonPicker,
    IonPickerColumnOption,
    IonPickerColumn,
    IonContent,
    IonRadio,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonModal,
    IonDatetime,
    IonButton,
  ],
  templateUrl: './add-drug.html',
  styleUrl: './add-drug.css',
})
export class AddDrug implements OnInit {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  isForm = false;
  isActiveIngredient = false;
  isProductName = false;
  isFrequency = false;
  form: Item[] = [];
  drugForm: FormGroup;
  activeIngredients: Item[] = [];
  productNames: Item[] = [];
  frequency: Item[] = [];
  loading = false;
  cycleDurations: any = [];
  label = 'Save';
  tabs = ['Day', 'Month'];
  activeTabIndex = 0;
  memberId: string;
  appointmentId: string;
  professionalId: string;
  referralId: string;
  dayOptions: any = [];
  monthOptions: any = [];
  private editingTimeIndex: number | null = null;
  isStrengthOpen = false;
  greenBook: GreenBookType;
  availableStrength: any[] = [];
  private router = inject(Router);
  private conversion = inject(ConversionService);
  private fb = inject(FormBuilder);
  useForUseOrPause = [1];
  payload: any;
  daysOfWeekLength: any = [];
  activeIngredient = new FormControl('', Validators.required);
  formSelected = new FormControl('', Validators.required);
  strength = new FormControl('', Validators.required);
  duration = new FormControl(1, Validators.required);
  durationType = new FormControl('Day', Validators.required);
  scheduleType = new FormControl(null, Validators.required);
  cycleFrequency = new FormControl('Day', Validators.required);
  selectedDay = 0;
  days = [
    { text: 'S', value: 1 },
    { text: 'M', value: 2 },
    { text: 'T', value: 3 },
    { text: 'W', value: 4 },
    { text: 'T', value: 5 },
    { text: 'F', value: 6 },
    { text: 'S', value: 7 },
  ];
  useFor: { unit: number }[] = [];
  times: { time: string; dosage: number }[] = [];
  isTimeModalOpen = false;
  selectedTime = '';
  isUnitModalOpen = false;
  editingUnitIndex: number | null = null;
  pendingUnit = 1;
  fewDaysMedication: any = [];
  weekIndex = null;
  isUnitPickerOpen = false;
  unitPickerIndex: number | null = null;
  startDate = new FormControl('', [Validators.required]);
  endDate = new FormControl('', [Validators.required]);

  frequencyTypes = [
    { text: 'Daily', value: 'Daily' },
    { text: 'Cycle-Based Schedule', value: 'Cycle-Based Schedule' },
    { text: 'Selected Days of the Week', value: 'Selected Days of the Week' },
    { text: 'At Regular Intervals', value: 'At Regular Intervals' },
    { text: 'As Needed', value: 'As Needed' },
  ];

  unitOptions: any = [];

  selectedFrequency = '';
  availableProduct: any[] = [];
  facilityType: string;
  facilityId: string;
  facilityTypeId: string;
  ionViewWillEnter() {
    this.load();
  }

  ngOnInit(): void {
    this.load();
    for (let index = 0; index < 100; index++) {
      this.cycleDurations.push(index + 1);
      this.unitOptions.push(index + 1);
    }
    for (let index = 2; index < 100; index++) {
      this.fewDaysMedication.push({ key: `Every ${index} Days`, value: index });
    }
  }

  reuse() {
    const days: any[] = [];
    for (let index = 0; index < 7; index++) {
      const isSelected = this.daysOfWeekLength.some(
        (week: any) => week.day[index]?.selected === true
      );
      days.push({
        day: index + 1,
        selected: isSelected ? null : false,
      });
    }
    this.daysOfWeekLength.push({
      day: days,
      usages: [],
    });
  }

  constructor() {
    addIcons({
      removeCircleOutline,
      addCircleOutline,
      pencilOutline,
      chevronUpOutline,
      'chevron-back-outline': chevronBackOutline,
    });
  }

  load() {
    this.conversion.convert(Frequency, this.frequency);

    this.activatedRoute.params.subscribe((params: any) => {
      this.memberId = params.memberId;
      this.appointmentId = params.appointmentId;
      this.professionalId = params.professionalId;
      this.referralId = params.referralId;
      this.facilityType = params.facilityType;
      this.facilityId = params.facilityId;
      this.facilityTypeId = params.facilityTypeId;
    });

    this.api
      .getGreenBookGroupsByFilter({
        greenbookType: GreenBookType.Drugs,
        filterType: 'Active Ingredients',
      } as any)
      .subscribe((response: any) => {
        this.activeIngredients = [];
        response?.forEach((drug: any) => {
          this.activeIngredients.push({ text: drug, value: drug });
        });
      });

    for (let i = 1; i <= 12; i++) {
      this.monthOptions.push({
        label: i.toString(),
        value: i,
      });
    }
    for (let i = 1; i <= 31; i++) {
      this.dayOptions.push({
        label: i.toString(),
        value: i,
      });
    }

    this.drugForm = this.fb.group({
      activeIngredient: this.activeIngredient,
      form: this.formSelected,
      itemType: GreenBookType.Drugs,
      duration: this.duration,
      durationType: this.durationType,
      scheduleType: this.scheduleType,
      strength: this.strength,
    });

    if (this.referralId) {
      this.api
        .getReferralEntry({
          referralId: this.referralId,
          referralType: ReferralType.Pharmacy,
        })
        .subscribe((res: any) => {
          this.memberId = res.memberId;
          this.appointmentId = res.appointmentId;
          this.setTab(res.durationType);
          this.duration = res.duration;
          this.drugForm.patchValue({
            activeIngredient: res.activeIngredient,
            form: res.form,
            itemType: res.type ?? res.itemType,
            duration: res.duration,
            durationType: res.durationType,
            frequencyOfUse: res.frequencyOfUse,
            scheduleType: res.scheduleType,
            strength: res.strength,
          });
          this.getGreenBookGroupsByFilter();
        });
    } else {
      this.referralId = v4();
    }
  }

  addAnotherWeek() {
    this.times = [];
    this.reuse();
  }

  goBack() {
    if (this.router.url.includes('nurse-dashboard')) {
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
        '/dashboard/view-appointment/',
        this.facilityType,
        this.facilityId,
        this.facilityTypeId,
        this.appointmentId,
        this.memberId,
      ]);
    }
  }
  getGreenBookGroupsByFilter() {
    this.api
      .getGreenBookGroupsByFilter({
        greenbookType: GreenBookType.Drugs,
        filterType: 'Form',
        activeIngredient: this.drugForm.value.activeIngredient,
      } as any)
      .subscribe((response: any) => {
        this.form = [];
        response?.forEach((drug: any) => {
          this.form.push({ text: drug, value: drug });
        });
      });
  }

  isFrequencyClicked() {
    this.isFrequency = true;
  }

  offFrequencyClicked() {
    this.isFrequency = false;
    this.daysOfWeekLength = [];
    this.times = [];
    this.weekIndex = null;
    this.payload = null;
    if (this.drugForm.value.scheduleType != null) {
      switch (this.drugForm.value.scheduleType) {
        case 'Cycle-Based Schedule':
          this.reuse();
          this.drugForm.setControl('cycleFrequency', this.cycleFrequency);
          break;
        default:
          break;
      }
    }
  }

  addTime() {
    this.editingTimeIndex = null;
    this.isTimeModalOpen = true;
    this.selectedTime = moment().format('YYYY-MM-DDTHH:mm:ss');
  }

  addNewTime(weekIndex: any) {
    this.editingTimeIndex = null;
    this.isTimeModalOpen = true;
    this.selectedTime = moment().format('YYYY-MM-DDTHH:mm:ss');
    this.weekIndex = weekIndex;
  }

  selectDay(day: any, weekIndex: number, index: number) {
    const selectedDay = this.daysOfWeekLength[weekIndex].day[index];

    if (selectedDay.selected) {
      this.daysOfWeekLength.forEach((week: any) => {
        if (week.day[index]) {
          week.day[index].selected = false;
        }
      });

      return;
    }

    this.daysOfWeekLength.forEach((week: any, currentWeekIndex: number) => {
      if (week.day[index]) {
        week.day[index].selected = currentWeekIndex === weekIndex ? true : null;
      }
    });
  }

  hasSelectedDay(week: any): boolean {
    return week?.day?.some((item: any) => item.selected === true) ?? false;
  }

  openTimePicker(index: number, weekIndex: any) {
    this.editingTimeIndex = index;
    const current = this.times[index]?.time;
    this.selectedTime = current
      ? moment(current, 'hh:mm A').format('YYYY-MM-DDTHH:mm:ss')
      : moment().format('YYYY-MM-DDTHH:mm:ss');
    this.isTimeModalOpen = true;
    if (weekIndex != null) {
      this.weekIndex = weekIndex;
    }
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

  changeCycleDuration(duration: any, type: string) {
    if (type === 'useFor') {
      this.payload = { ...this.payload, useFor: duration?.detail.value };
    } else {
      this.payload = { ...this.payload, pauseFor: duration?.detail.value };
    }
  }

  changeFewDaysMedication(interval: any) {
    this.payload = { ...this.payload, interval: interval?.detail?.value };
  }

  unitPickerButtons = [
    { text: 'Cancel', role: 'cancel' },
    {
      text: 'Confirm',
      handler: (value: any) => {
        const selected = value?.unit?.value;
        if (this.unitPickerIndex !== null && selected) {
          this.times[this.unitPickerIndex].dosage = selected;
        }
        this.unitPickerIndex = null;
      },
    },
  ];

  onDateTimeChange(time: any) {
    this.selectedTime = time;
  }

  confirmTime() {
    const formatted = moment(this.selectedTime).format('hh:mm');
    if (this.editingTimeIndex !== null) {
      this.times[this.editingTimeIndex].time = formatted;
    } else {
      this.times.push({ time: formatted, dosage: 1 });
    }
    this.isTimeModalOpen = false;
    this.editingTimeIndex = null;
    if (this.weekIndex != null) {
      this.daysOfWeekLength[this.weekIndex].usages = this.times;
    } else {
      this.payload = { ...this.payload, usages: this.times };
    }
  }

  onTimeModalDismiss() {
    this.isTimeModalOpen = false;
    this.editingTimeIndex = null;
  }

  removeTime(index: number, weekIndex: any) {
    this.times.splice(index, 1);
    if (weekIndex != null) {
      this.daysOfWeekLength[weekIndex].usages = this.times;
    } else {
      this.payload = { ...this.payload, usages: this.times };
    }
  }

  openUnitPicker(index: number, weekIndex: any) {
    this.unitPickerIndex = index;
    this.isUnitPickerOpen = true;
    if (weekIndex != null) {
      this.weekIndex = weekIndex;
    }
  }

  confirmUnit(value: any) {
    if (this.unitPickerIndex !== null) {
      this.times[this.unitPickerIndex].dosage = value;
    }
    this.isUnitPickerOpen = false;
    this.unitPickerIndex = null;
    if (this.weekIndex != null) {
      this.daysOfWeekLength[this.weekIndex].usages = this.times;
    } else {
      this.payload = { ...this.payload, usages: this.times };
    }
  }

  changeCycleFrequency(frequency: any) {
    this.payload = { ...this.payload, frequency: frequency.detail?.value };
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

  checkStrength(strength: any) {
    this.availableStrength = [];
    const { form, activeIngredient } = this.drugForm.value;
    this.api
      .getGreenBookItems({
        greenbookType: GreenBookType.Drugs,
        activeIngredient,
        form,
      })
      .subscribe((response: any) => {
        if (strength.length === 0) {
          this.availableStrength = response.data;
          this.isStrengthOpen = true;
          return;
        }
        this.availableStrength = response.data.filter((item: any) =>
          item.strength.toLowerCase().includes(strength.toLowerCase())
        );
        this.isStrengthOpen = true;
      });
  }

  selectProductStrength(strength: string) {
    this.drugForm.patchValue({ strength: strength });
    this.isStrengthOpen = false;
  }
  isFormClicked() {
    this.isForm = true;
    this.isActiveIngredient = false;
    this.isProductName = false;
    this.isFrequency = false;
  }
  offFormClicked() {
    this.isForm = false;
  }

  isActiveIngredientClicked() {
    this.isActiveIngredient = true;
    this.isForm = false;
    this.isProductName = false;
    this.isFrequency = false;
  }
  offActiveIngredientClicked() {
    this.isActiveIngredient = false;
    this.getGreenBookGroupsByFilter();
  }
  isProductNameClicked() {
    this.isProductName = true;
    this.isForm = false;
    this.isActiveIngredient = false;
    this.isFrequency = false;
  }

  isStrengthClicked() {
    this.isFrequency = true;
    this.isForm = false;
    this.isActiveIngredient = false;
    this.isProductName = false;
  }
  offStrengthClicked() {
    this.isFrequency = false;
  }

  next() {
    this.loading = true;
    this.label = 'Please Wait';
    const daysOfWeek =
      this.drugForm?.value?.scheduleType === 'Selected Days of the Week'
        ? this.daysOfWeekLength.flatMap((week: any) =>
            week.day
              .filter((day: any) => day.selected === true)
              .map((day: any) => ({
                dayOfWeek: day.day,
                usages: week.usages,
              }))
          )
        : {};
    if (this.drugForm?.value?.scheduleType === 'Selected Days of the Week') {
      this.payload = { dayOfWeek: daysOfWeek };
    } else {
      this.payload = { ...this.payload, frequency:this.drugForm.value?.cycleFrequency };
    }
    const allPayload = {
      ...this.drugForm.value,
      scheduleType: this.payload,
      appointmentId: this.appointmentId,
      memberId: this.memberId,
      referralId: this.referralId,
    };
    this.api
      .addAppointmentReferral({
        appointmentId: this.appointmentId,
        referralId: this.referralId,
        referralType: ReferralType.Pharmacy,
        body: {
          ...allPayload,
        },
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.label = 'Save';
          this.daysOfWeekLength = [];
          this.times = [];
          this.weekIndex = null;
          this.payload = null;
          this.goBack();
          Object.keys(this.drugForm.controls).forEach((key) => {
            this.drugForm.get(key)?.setValue('');
          });
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  disableButton() {
    if (this.drugForm.value.scheduleType === 'Selected Days of the Week') {
      return !this.daysOfWeekLength.some(
        (query: any) => query.usages?.[query.usages.length - 1]?.time == null
      );
    } else if (this.drugForm.value.scheduleType === 'As Needed') {
      return true;
    } else {
      return !(
        this.times?.some((query: any) => query.time == null) ||
        this.times.length === 0
      );
    }
  }

  disableNextButton() {
    if (this.drugForm.value.scheduleType == 'Selected Days of the Week') {
      return this.daysOfWeekLength.length == 0;
    } else if (this.drugForm.value.scheduleType == 'Cycle-Based Schedule') {
      return (
        this.payload == null ||
        (this.payload.useFor == null && this.payload.pauseFor == null)
      );
    } else if (this.drugForm.value.scheduleType == 'As Needed') {
      return false;
    } else {
      return this.payload == null;
    }
  }

  setTab(tab: string) {
    if (tab === 'Day') {
      this.activeTabIndex = 0;
      this.drugForm.patchValue({
        durationType: 'Day',
        duration: 1,
      });
    } else {
      this.activeTabIndex = 1;
      this.drugForm.patchValue({
        durationType: 'Month',
        duration: 1,
      });
    }
  }

  onDayChange(event: CustomEvent) {
    if (this.activeTabIndex === 0) {
      this.drugForm.patchValue({
        duration: event.detail.value,
        durationType: 'Day',
      });
    }
  }

  onMonthChange(event: CustomEvent) {
    if (this.activeTabIndex === 1) {
      this.drugForm.patchValue({
        duration: event.detail.value,
        durationType: 'Month',
      });
    }
  }
}
