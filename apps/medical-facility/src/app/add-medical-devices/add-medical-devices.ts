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
import { ButtonComponent, InputComponent, Item } from '@care-way/ui';
import { IonIcon, IonText } from '@ionic/angular/standalone';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-add-medical-devices',
  imports: [
    CommonModule,
    IonIcon,
    IonText,
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './add-medical-devices.html',
  styleUrl: './add-medical-devices.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddMedicalDevices implements OnInit {
  isCategory = false;
  isForm = false;
  isProductName = false;
  isQuantity = false;
  activeIngredients: Item[] = [];
  productNames: Item[] = [];
  forms: Item[] = [];
  availableProduct: any[] = [];
  strength: Item[] = [];
  loading = false;
  isActiveIngredient = false;

  memberId: string;
  facilityType: string;
  facilityId: string;
  facilityTypeId: string;
  appointmentId: string;
  professionalId: string;
  referralId: string;
  label = 'Save';
  form: FormGroup;
  activeIngredient = new FormControl('', Validators.required);
  productName = new FormControl('', Validators.required);
  quantities = new FormControl('', Validators.required);
  formSelected = new FormControl('', Validators.required);
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);

  private router = inject(Router);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.memberId = params.memberId;
      this.appointmentId = params.appointmentId;
      this.professionalId = params.professionalId;
      this.referralId = params.referralId;
      this.facilityType = params.facilityType;
      this.facilityId = params.facilityId;
      this.facilityTypeId = params.facilityTypeId;
    });
    this.form = this.fb.group({
      activeIngredient: this.activeIngredient,
      product: this.productName,
      quantity: this.quantities,
      form: this.formSelected,
      type: GreenBookType.MedicalDevices,
    });

    this.api
      .getGreenBookGroupsByFilter({
        greenbookType: GreenBookType.MedicalDevices,
        filterType: 'Active Ingredients',
      } as any)
      .subscribe((response: any) => {
        this.activeIngredients = [];
        response?.forEach((drug: any) => {
          this.activeIngredients.push({ text: drug, value: drug });
        });
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
          this.form.patchValue({
            activeIngredient: res.activeIngredient,
            form: res.form,
            type: res.type,
            product: res.product,
            quantity: res.quantity,
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
        greenbookType: GreenBookType.MedicalDevices,
        form: this.form.value?.form,
        activeIngredient: this.form.value?.activeIngredient,
        status: 'Active',
      } as any)
      .subscribe((res: any) => {
        res?.data?.forEach((name: any) => {
          this.availableProduct = [];
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
        greenbookType: GreenBookType.MedicalDevices,
        filterType: 'Form',
        activeIngredient: this.form.value.activeIngredient,
      } as any)
      .subscribe((response: any) => {
        response?.forEach((drug: any) => {
          this.forms.push({ text: drug, value: drug });
        });
      });
  }
  isFormClicked() {
    this.isForm = true;
    this.isActiveIngredient = false;
    this.isProductName = false;
  }
  offFormClicked() {
    this.isForm = false;
    this.productNames = [];
    this.availableProduct = [];
    this.getGreenBookItems();
  }
  isActiveIngredientClicked() {
    this.isActiveIngredient = true;
    this.isProductName = false;
    this.isForm = false;
  }
  offActiveIngredientClicked() {
    this.isActiveIngredient = false;
    this.forms = [];
    this.getGreenBookGroupsByFilter();
  }
  offCategoryClicked() {
    this.isCategory = false;
  }
  isProductNameClicked() {
    this.isProductName = true;
    this.isActiveIngredient = false;
    this.isForm = false;
  }
  offProductNameClicked() {
    this.isProductName = false;
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
          ...this.form.value,
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
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
