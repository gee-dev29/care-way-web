import { CommonModule } from '@angular/common';
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
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, GreenBookType, ReferralType } from '@care-way/api';
import { ConversionService, Frequency } from '@care-way/shared';
import { ButtonComponent, InputComponent, Item } from '@care-way/ui';
import {
  IonIcon,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonText,
} from '@ionic/angular/standalone';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-add-herbals-and-nutraceuticals',
  imports: [
    CommonModule,
    IonIcon,
    IonText,
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    FormsModule,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
  ],
  templateUrl: './add-herbals-and-nutraceuticals.html',
  styleUrl: './add-herbals-and-nutraceuticals.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddHerbalsAndNutraceuticals implements OnInit {
  private router = inject(Router);
  private conversion = inject(ConversionService);
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  isForm = false;
  isActiveIngredient = false;
  isProductName = false;
  isStrength = false;
  isFrequency = false;

  form: Item[] = [];
  frequency: Item[] = [];
  activeIngredients: Item[] = [];
  productNames: Item[] = [];
  strengths: Item[] = [];
  referralType = ReferralType.Pharmacy;
  isStrengthOpen = false;
  loading = false;
  label = 'Save';
  availableStrength: any[] = [];
  tabs = ['Day', 'Month'];
  activeTabIndex = 0;

  dayOptions: any[] = [];
  monthOptions: any[] = [];
  facilityType: string;
  facilityId: string;
  facilityTypeId: string;
  memberId: string;
  appointmentId: string;
  professionalId: string;
  referralId: string;

  herbalForm: FormGroup;

  activeIngredient = new FormControl('', Validators.required);
  formSelected = new FormControl('', Validators.required);
  frequencyOfUse = new FormControl('', Validators.required);
  duration = new FormControl('', Validators.required);
  durationType = new FormControl('', Validators.required);
  strength = new FormControl('', Validators.required);

  availableProduct: any[] = [];

  ngOnInit(): void {
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
        greenbookType: GreenBookType.HerbalsAndNutraceuticals,
        filterType: 'Active Ingredients',
      } as any)
      .subscribe((response: any) => {
        this.activeIngredients = [];
        response?.forEach((x: any) => {
          this.activeIngredients.push({ text: x, value: x });
        });
      });

    for (let i = 1; i <= 12; i++) {
      this.monthOptions.push({ label: i.toString(), value: i });
    }

    for (let i = 1; i <= 31; i++) {
      this.dayOptions.push({ label: i.toString(), value: i });
    }

    this.herbalForm = this.fb.group({
      activeIngredient: this.activeIngredient,
      form: this.formSelected,
      frequencyOfUse: this.frequencyOfUse,
      duration: this.duration,
      durationType: this.durationType,
      type: GreenBookType.HerbalsAndNutraceuticals,
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
          this.herbalForm.patchValue({
            activeIngredient: res.activeIngredient,
            form: res.form,
            type: res.type,
            duration: res.duration,
            durationType: res.durationType,
            frequencyOfUse: res.frequencyOfUse,
            strength: res.strength,
          });
          this.getGreenBookGroupsByFilter();
        });
    } else {
      this.referralId = v4();
    }
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
  checkStrength(strength: any) {
    this.availableStrength = [];
    const { form, activeIngredient } = this.herbalForm.value;
    this.api
      .getGreenBookItems({
        greenbookType: GreenBookType.HerbalsAndNutraceuticals,
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
    this.herbalForm.patchValue({ strength: strength });
    this.isStrengthOpen = false;
  }
  getGreenBookGroupsByFilter() {
    this.api
      .getGreenBookGroupsByFilter({
        greenbookType: GreenBookType.HerbalsAndNutraceuticals,
        filterType: 'Form',
        activeIngredient: this.herbalForm.value.activeIngredient,
      } as any)
      .subscribe((response: any) => {
        this.form = [];
        response?.forEach((drug: any) =>
          this.form.push({ text: drug, value: drug })
        );
      });
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

  offProductNameClicked() {
    this.isProductName = false;
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

    this.api
      .addAppointmentReferral({
        appointmentId: this.appointmentId,
        referralId: this.referralId,
        referralType: ReferralType.Pharmacy,
        body: {
          ...this.herbalForm.value,
          appointmentId: this.appointmentId,
          memberId: this.memberId,
          referralId: this.referralId,
        },
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.label = 'Save';
          this.goBack();
          Object.keys(this.herbalForm.controls).forEach((key) => {
            this.herbalForm.get(key)?.setValue('');
          });
        },
        error: () => {
          this.loading = false;
          this.label = 'Save';
        },
      });
  }

  setTab(tab: string) {
    if (tab === 'Day') {
      this.activeTabIndex = 0;
      this.herbalForm.patchValue({
        durationType: 'Day',
        duration: this.duration,
      });
    } else {
      this.activeTabIndex = 1;
      this.herbalForm.patchValue({
        durationType: 'Month',
        duration: this.duration,
      });
    }
  }

  onDayChange(event: CustomEvent) {
    if (this.activeTabIndex === 0) {
      this.herbalForm.patchValue({
        duration: event.detail.value,
        durationType: 'Day',
      });
    }
  }

  onMonthChange(event: CustomEvent) {
    if (this.activeTabIndex === 1) {
      this.herbalForm.patchValue({
        duration: event.detail.value,
        durationType: 'Month',
      });
    }
  }
}
