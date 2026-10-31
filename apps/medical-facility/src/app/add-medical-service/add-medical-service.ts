import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService, ProductType, ReferralType } from '@healbridge/api';
import {
  IonCheckbox,
  IonContent,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { v4 } from 'uuid';
import { ButtonComponent, InputComponent, Item } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-add-medical-service',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    IonContent,
    IonIcon,
    IonText,
    IonCheckbox,
  ],
  templateUrl: './add-medical-service.html',
  styleUrl: './add-medical-service.css',
})
export class AddMedicalService implements OnInit {
  private formBuilder = inject(FormBuilder);
  private api = inject(ApiService);
  private location = inject(Location);
  private route = inject(ActivatedRoute);

  productType = new FormControl('', Validators.required);
  productName = new FormControl('', Validators.required);
  quantity = new FormControl(1, [Validators.required, Validators.min(1)]);
  unitPrice = new FormControl('', [Validators.required, Validators.min(0)]);
  requiresDelivery = new FormControl(false);

  form: FormGroup;
  loading = false;
  label = 'Save';
  facilityTypeId: string;
  medicalProductId: string | null = null;
  isProductType = false;
  isProductName = false;

  appointmentId: string | null = null;
  memberId: string | null = null;
  referralId: string | null = null;
  isAppointmentReferral = false;
  productOptions: any[] = [];
  private loadedProductType: string | null = null;

  productTypes: Item[] = Object.values(ProductType).map((productType) => ({
    text: productType,
    value: productType,
  }));

  constructor() {
    addIcons({ 'left-arrow': chevronBackOutline });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      productType: this.productType,
      productName: this.productName,
      unitPrice: this.unitPrice,
      requiresDelivery: this.requiresDelivery,
    });

    this.productType.valueChanges.subscribe((productType: any) =>
      this.onProductTypeSelected(productType)
    );

    this.route.params.subscribe((params: any) => {
      this.facilityTypeId =
        params.categoryId ??
        params.facilityTypeId ??
        params.hospitalId ??
        params.pharmacyId ??
        params.professionalId ??
        params.laboratoryId ??
        params.bloodBankId;

      this.appointmentId = params.appointmentId ?? null;
      this.memberId = params.memberId ?? null;
      this.isAppointmentReferral = !!this.appointmentId || !!params.referralId;

      if (params.referralId) {
        this.referralId = params.referralId;
        this.label = 'Update';
        this.form.addControl('quantity', this.quantity);
        this.api
          .getReferralEntry({
            referralId: params.referralId,
            referralType: ReferralType.MedicalProduct,
          })
          .subscribe((referral: any) => {
            this.appointmentId = referral.appointmentId ?? this.appointmentId;
            this.memberId = referral.memberId ?? this.memberId;
            this.form.patchValue({
              productType: referral.productType,
              productName: referral.productName,
              unitPrice: referral.unitPrice,
              requiresDelivery: referral.requiresDelivery,
            });
            this.quantity.setValue(referral.quantity ?? 1);
          });
      } else if (this.isAppointmentReferral) {
        this.referralId = v4();
        this.form.addControl('quantity', this.quantity);
      }
    });
  }

  loadMedicalProducts(productType?: string) {
    this.api
      .getMedicalProducts({
        facilityTypeId: this.facilityTypeId,
        skip: 0,
        limit: 100,
        productType: productType || undefined,
      })
      .subscribe((res: any) => {
        this.productOptions = (res.data ?? []).map((product: any) => ({
          text: product.productName,
          value: product.medicalProductId,
          productType: product.productType,
          unitPrice: product.unitPrice,
          requiresDelivery: product.requiresDelivery,
        }));
      });
  }

  back() {
    this.location.back();
  }

  onProductTypeSelected(productType: any) {
    if (!productType || !this.isAppointmentReferral) return;
    if (productType === this.loadedProductType) return;
    this.loadedProductType = productType;
    this.productName.setValue('', { emitEvent: false });
    this.productOptions = [];
    this.loadMedicalProducts(productType);
  }

  isProductTypeClicked() {
    this.isProductType = true;
  }

  offProductTypeClicked() {
    this.isProductType = false;
  }

  isProductNameClicked() {
    this.isProductName = true;
  }

  offProductNameClicked() {
    this.isProductName = false;
  }

  selectMedicalProduct(item: any) {
    this.loadedProductType = item.productType;
    this.form.patchValue({
      productName: item.text,
      productType: item.productType,
      unitPrice: item.unitPrice,
      requiresDelivery: item.requiresDelivery,
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.label = 'Please Wait';

    if (this.isAppointmentReferral) {
      this.api
        .addAppointmentReferral({
          appointmentId: this.appointmentId as string,
          referralId: this.referralId as string,
          referralType: ReferralType.MedicalProduct,
          body: {
            ...this.form.value,
            appointmentId: this.appointmentId,
            memberId: this.memberId,
            referralId: this.referralId,
          },
        })
        .subscribe({
          next: () => {
            this.loading = false;
            this.label = 'Save';
            this.back();
            this.clearForm();
          },
          error: () => {
            this.loading = false;
            this.label = 'Save';
          },
        });
      return;
    }

    this.api
      .createMedicalProduct({
        facilityTypeId: this.facilityTypeId,
        body: {
          medicalProductId: v4(),
          productType: this.form.value.productType,
          productName: this.form.value.productName,
          unitPrice: this.form.value.unitPrice,
          requiresDelivery: this.form.value.requiresDelivery,
        } as any,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.label = 'Save';
          this.back();
          if (!this.medicalProductId) this.clearForm();
        },
        error: () => {
          this.loading = false;
          this.label = 'Save';
        },
      });
  }

  private clearForm() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key)?.setValue('');
    });
  }
}
