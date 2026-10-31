import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, BloodProduct, FacilityType } from '@healbridge/api';
import { ConversionService } from '@healbridge/shared';
import { ButtonComponent, InputComponent, ToastService } from '@healbridge/ui';
import {
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'medical-facility-blood-bank-list',
  imports: [
    IonText,
    IonCard,
    IonCardContent,
    IonCheckbox,
    ButtonComponent,
    IonItem,
    IonLabel,
    ReactiveFormsModule,
    FormsModule,
    IonContent,
    IonIcon,
    InputComponent,
  ],
  templateUrl: './blood-bank-list.html',
  styleUrl: './blood-bank-list.css',
})
export class BloodBankList implements OnInit {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private conversionService = inject(ConversionService);

  facilityId: string;
  bloodBankId: string;
  isClicked = false;
  edit = '';
  loading = false;
  bloodBankListItems: any = [];
  label = 'Next';
  name = new FormControl('', [Validators.required]);

    constructor() {
      addIcons({ 'chevron-back-outline': chevronBackOutline });
    }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.facilityId = params.facilityId;
      this.bloodBankId = params.bloodBankId;
      this.edit = params.edit;
    });

    this.conversionService.convert(BloodProduct, this.bloodBankListItems);

    if (this.edit?.length) {
      this.getCategory();
    } else {
      this.api
        .getFacilityTypesOfFacility({
          facilityId: this.facilityId,
          facilityType: FacilityType.BloodBank,
        } as any)
        .subscribe((res: any) => {
          const bloodBank = res.filter(
            (item: any) => item.facilityType === FacilityType.BloodBank
          );

          if (bloodBank.length === 0) {
            this.name.setValue(`${res[0].facilityName} Blood Bank 1`);
          } else {
            this.name.setValue(
              `${bloodBank[0].facilityName} Blood Bank ${bloodBank.length + 1}`
            );
          }
        });

      this.bloodBankListItems.forEach((category: any) => {
        category.check = false;
      });
    }
  }

    goBack() {
     this.router.navigate([
              '/dashboard/blood-bank-profile',
              this.facilityId,
              this.bloodBankId,
            ]);
  }

  getCategory() {
    this.api
      .getFacilityTypeById({
        facilityId: this.facilityId,
        facilityType: FacilityType.BloodBank,
        facilityTypeId: this.bloodBankId,
      })
      .subscribe((res: any) => {
        this.name.setValue(res.name);

        this.bloodBankListItems.forEach((category: any) => {
          category.check = res.bloodProducts.includes(category.text);
        });
      });
  }

  proceed() {
    this.loading = true;
    this.label = 'Please Wait';

    const categoriesSelected = this.checkCategorySelected();

    const payload = {
      facilityId: this.facilityId,
      bloodBankId: this.bloodBankId,
      bloodProducts: categoriesSelected,
      name: this.name.value || undefined,
    };

    this.api
      .createFacilityType({
        facilityId: this.facilityId,
        facilityType: FacilityType.BloodBank,
        facilityTypeId: this.bloodBankId,
        body: payload,
      } as any)
      .subscribe({
        next: () => {
          this.loading = false;
          this.label = 'Continue';

          if (this.edit?.length) {
            this.toast.show(
              'Blood Bank updated successfully',
              'success'
            );

            this.router.navigate([
              '/dashboard/blood-bank-profile',
              this.facilityId,
              this.bloodBankId,
            ]);
          } else {
            this.toast.show(
              'Blood Bank created successfully',
              'success'
            );

            this.router.navigate([
              '/dashboard/blood-bank-onboarding',
              this.facilityId,
              this.bloodBankId,
              'blood-bank-license-details',
            ]);
          }
        },
        error: (err) => {
          this.loading = false;
          this.label = 'Continue';

          this.toast.show(
            err?.detail || 'Failed to create facility type',
            'error'
          );
        },
      });
  }

  selectType(type: any, index: any) {
    this.bloodBankListItems[index].check =
      !this.bloodBankListItems[index].check;
  }

  checkCategorySelected(): [] {
    const categories: any = [];
    this.bloodBankListItems.forEach((category: any) => {
      if (category.check) {
        categories.push(category.text);
      }
    });
    return categories;
  }
  checkIfAnyIsEmpty(): boolean {
    return this.bloodBankListItems.some((item: any) => item.check === true);
  }

  isActiveClicked() {
    this.isClicked = true;
  }

  offActiveClicked() {
    this.isClicked = false;
  }

  onCheckboxChange(item: any) {
    const selectedItems = this.bloodBankListItems.filter((i: any) => i.checked);
  }
}
