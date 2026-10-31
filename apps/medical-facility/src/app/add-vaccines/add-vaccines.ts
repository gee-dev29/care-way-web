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
import { ApiService, GreenBookType, ReferralType } from '@healbridge/api';
import { ConversionService, Frequency } from '@healbridge/shared';

import { ButtonComponent, InputComponent, Item } from '@healbridge/ui';
import { IonIcon, IonText } from '@ionic/angular/standalone';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-add-vaccines',
  imports: [
    CommonModule,
    IonIcon,
    IonText,
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './add-vaccines.html',
  styleUrl: './add-vaccines.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddVaccines implements OnInit {
  isForm = false;
  isActiveIngredient = false;
  isProductName = false;
  form: Item[] = [];
  activeIngredients: Item[] = [];
  productNames: Item[] = [];
  strengths: Item[] = [];
  frequency: Item[] = [];
  loading = false;
  isFrequency = false;
  label = 'Save';
  tabs = ['Day', 'Month'];
  activeTabIndex = 0;
  dayOptions: any = [];
  monthOptions: any = [];
  memberId: string;
  appointmentId: string;
  referralId: string;
  professionalId: string;
  vaccineForm: FormGroup;
  activeIngredient = new FormControl('', Validators.required);
  formSelected = new FormControl('', Validators.required);
  frequencyOfUse = new FormControl('', Validators.required);
  strength = new FormControl('', Validators.required);
  productName = new FormControl('', Validators.required);
  duration = new FormControl('', Validators.required);
  durationType = new FormControl('', Validators.required);

  private router = inject(Router);
  private conversion = inject(ConversionService);
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  availableProduct: any[] = [];
  facilityType: string;
  facilityId: string;
  facilityTypeId: string;

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
        greenbookType: GreenBookType.VaccinesAndBiologics,
        filterType: 'Active Ingredients',
      } as any)
      .subscribe((response: any) => {
        this.activeIngredients = [];
        response?.forEach((drug: any) => {
          this.activeIngredients.push({ text: drug, value: drug });
        });
      });

    this.vaccineForm = this.fb.group({
      activeIngredient: this.activeIngredient,
      form: this.formSelected,
      type: GreenBookType.VaccinesAndBiologics,
      strength: this.strength,
      productName: this.productName,
      duration: this.duration,
      durationType: this.durationType,
      frequencyOfUse: this.frequencyOfUse,
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
    if (this.referralId) {
      this.api
        .getReferralEntry({
          referralId: this.referralId,
          referralType: ReferralType.Pharmacy,
        })
        .subscribe((res: any) => {
          this.memberId = res.memberId;
          this.appointmentId = res.appointmentId;
          this.duration = res.duration;
          this.setTab(res.durationType);
          this.vaccineForm.patchValue({
            activeIngredient: res.activeIngredient,
            form: res.form,
            type: res.type,
            duration: res.duration,
            durationType: res.durationType,
            frequencyOfUse: res.frequencyOfUse,
            strength: res.strength,
          });

          this.getGreenBookItems();
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
  getGreenBookItems() {
    this.api
      .getGreenBookItems({
        greenbookType: GreenBookType.VaccinesAndBiologics,
        form: this.vaccineForm.value?.form,
        activeIngredient: this.vaccineForm.value?.activeIngredient,
        status: 'Active',
      } as any)
      .subscribe((res: any) => {
        res?.data?.forEach((name: any) => {
          this.availableProduct.push(name);
          this.productNames.push({
            text: name.productName,
            value: name.productName,
          });
        });
      });
  }
  getGreenBookGroupsByFilter() {
    this.api
      .getGreenBookGroupsByFilter({
        greenbookType: GreenBookType.VaccinesAndBiologics,
        filterType: 'Form',
        activeIngredient: this.vaccineForm.value.activeIngredient,
      } as any)
      .subscribe((response: any) => {
        response?.forEach((drug: any) => {
          this.form.push({ text: drug, value: drug });
        });
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
    this.availableProduct = [];
    this.productNames = [];
    this.getGreenBookItems();
  }
  isActiveIngredientClicked() {
    this.isActiveIngredient = true;
    this.isForm = false;
    this.isProductName = false;
    this.isFrequency = false;
  }
  offActiveIngredientClicked() {
    this.isActiveIngredient = false;
    this.form = [];

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

    const selected = this.availableProduct.find(
      (x) => x.productName === this.vaccineForm.value.productName
    );

    if (selected) {
      this.vaccineForm.patchValue({
        strength: selected.strength,
      });
    }
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
          ...this.vaccineForm.value,
          appointmentId: this.appointmentId,
          memberId: this.memberId,
          referralId: this.referralId,
        },
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.label = 'Save';
          this.goBack();
          Object.keys(this.vaccineForm.controls).forEach((key) => {
            this.vaccineForm.get(key)?.setValue('');
          });
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  setTab(tab: string) {
    if (tab === 'Day') {
      this.activeTabIndex = 0;
      this.vaccineForm.patchValue({
        durationType: 'Day',
        duration: this.duration,
      });
    } else {
      this.activeTabIndex = 1;
      this.vaccineForm.patchValue({
        durationType: 'Month',
        duration: this.duration,
      });
    }
  }

  onDayChange(event: CustomEvent) {
    if (this.activeTabIndex === 0) {
      this.vaccineForm.patchValue({
        duration: event.detail.value,
        durationType: 'Day',
      });
    }
  }

  onMonthChange(event: CustomEvent) {
    if (this.activeTabIndex === 1) {
      this.vaccineForm.patchValue({
        duration: event.detail.value,
        durationType: 'Month',
      });
    }
  }
}
