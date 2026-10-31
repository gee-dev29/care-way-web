import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonText,
  IonIcon,
  IonCheckbox,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ButtonComponent, InputComponent, ToastService } from '@care-way/ui';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, FacilityType, GreenBookType } from '@care-way/api';
import { Validators, FormControl } from '@angular/forms';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'medical-facility-pharm-category',
  imports: [
    ButtonComponent,
    IonText,
    CommonModule,
    IonCard,
    IonCardContent,
    IonIcon,
    IonCheckbox,
    InputComponent,
  ],
  templateUrl: './pharm-category.html',
  styleUrl: './pharm-category.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PharmCategory implements OnInit {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  facilityId: string;
  pharmacyId: string;
  edit = '';
  loading = false;
  name = new FormControl('', [Validators.required]);
  questions: any = [
    {
      text: 'Do you provide pharmaceutical drugs?',
      check: false,
      icon: '/icons/pharmIcon.svg',
      value: GreenBookType.Drugs,
    },
    {
      text: 'Do you offer vaccines and biologics?',
      check: false,
      icon: '/icons/vaccineIcon.svg',
      value: GreenBookType.VaccinesAndBiologics,
    },
    {
      text: 'Do you supply medical devices?',
      check: false,
      icon: '/icons/medicalDeviceIcon.svg',
      value: GreenBookType.MedicalDevices,
    },
    {
      text: 'Do you offer herbal and nutraceutical products?',
      check: false,
      icon: '/icons/herbalIcon.svg',
      value: GreenBookType.HerbalsAndNutraceuticals,
    },
  ];
  label = 'Continue';

   constructor() {
      addIcons({ 'chevron-back-outline': chevronBackOutline });
    }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      this.edit = params.edit;
      if (this.edit?.length) {
        this.api
          .getFacilityTypeById({
            facilityId: this.facilityId,
            facilityType: FacilityType.Pharmacy,
            facilityTypeId: this.pharmacyId,
          } as any)
          .subscribe((res: any) => {
            const selectedCategories: GreenBookType[] =
              res.productCategories || [];
            this.name.setValue(res.name);

            this.questions = this.questions.map((question: any) => ({
              ...question,
              check: selectedCategories.includes(question.value),
            }));
          });
      } else {
        this.api
          .getFacilityTypesOfFacility({
            facilityId: this.facilityId,
            facilityType: FacilityType.Pharmacy,
          } as any)
          .subscribe((res: any) => {
            const pharmacy = res.filter(
              (item: any) => item.facilityType === FacilityType.Pharmacy
            );

            if (pharmacy.length === 0) {
              this.name.setValue(`Pharmacy 1`);
            } else {
              this.name.setValue(
                `${pharmacy[0].facilityName}-Pharmacy-${pharmacy.length + 1}`
              );
            }
          });
      }
    });
  }
   goBack() {
   this.router.navigate([
              '/dashboard/pharm-profile',
              this.facilityId,
              this.pharmacyId,
            ]);
  }

  proceed() {
    this.loading = true;
    this.label = 'Please Wait';

    const categoriesSelected = this.checkCategorySelected();

    const payload = {
      facilityId: this.facilityId,
      pharmacyId: this.pharmacyId,
      productCategories: categoriesSelected,
      name: this.name.value || undefined,
    };

    this.api
      .createFacilityType({
        facilityId: this.facilityId,
        facilityTypeId: this.pharmacyId,
        facilityType: FacilityType.Pharmacy,
        body: payload,
      })
      .subscribe({
        next: () => {
          if (this.edit?.length) {
            this.toast.show(
              'Pharmacy updated successfully',
              'success'
            );
            this.router.navigate([
              '/dashboard/pharm-profile',
              this.facilityId,
              this.pharmacyId,
            ]);
          } else {
            this.toast.show(
              'Pharmacy created successfully',
              'success'
            );
            this.router.navigate([
              '/dashboard/pharmacy-onboarding',
              this.facilityId,
              this.pharmacyId,
              'pharm-license',
            ]);
          }
        },
        error: (err) => {
          this.toast.show('Something went wrong', 'error');
          this.label = 'Continue';
          this.loading = false;
        },
        complete: () => {
          this.label = 'Continue';
          this.loading = false;
        },
      });
  }

  selectType(type: any, index: any) {
    this.questions[index].check = !this.questions[index].check;
  }

  checkCategorySelected(): [] {
    const categories: any = [];
    this.questions.forEach((category: any) => {
      if (category.check) {
        categories.push(category.value);
      }
    });
    return categories;
  }

  checkIfAnyIsEmpty(): boolean {
    return this.questions.some((q: any) => q.check === true);
  }
}
