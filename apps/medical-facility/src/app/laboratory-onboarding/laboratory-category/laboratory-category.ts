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
  IonCheckbox,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  InputComponent,
  LimitSize,
  ToastService,
} from '@healbridge/ui';
import {
  ConversionService,
  FacilityType,
} from '@healbridge/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { FormControl, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'medical-facility-laboratory-category',
  imports: [
    ButtonComponent,
    IonText,
    CommonModule,
    IonCard,
    IonCardContent,
    IonCheckbox,
    InputComponent,
  ],
  templateUrl: './laboratory-category.html',
  styleUrl: './laboratory-category.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LaboratoryCategory implements OnInit {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private conversionService = inject(ConversionService);
  facilityId: string;
  laboratoryId: string;
  specialization: any = [];
  isClicked = false;
  edit = '';
  loading = false;
  categories: any = [];
  label = 'Continue';
  name = new FormControl('', [Validators.required]);

   constructor() {
      addIcons({ 'chevron-back-outline': chevronBackOutline });
    }

  ngOnInit(): void {
    this.api
      .getLabGroups({ skip: 0, limit: LimitSize.DropDown })
      .subscribe((response: any) => {
        response.forEach((res: any) => {
          const remap = {
            text: res,
            value: res,
          };
          this.categories.push(remap);
        });
      });

    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.laboratoryId = params.laboratoryId;
      this.edit = params.edit;
      if (this.edit?.length) {
        this.getCategory();
      } else {
        this.api
          .getFacilityTypesOfFacility({
            facilityId: this.facilityId,
            facilityType: FacilityType.Laboratory,
          } as any)
          .subscribe((res: any) => {
            const laboratory = res.filter(
              (item: any) => item.facilityType === FacilityType.Laboratory
            );

            if (laboratory.length === 0) {
              this.name.setValue(`${res[0].facilityName} Laboratory 1`);
            } else {
              this.name.setValue(
                `${laboratory[0].facilityName} Laboratory ${
                  laboratory.length + 1
                }`
              );
            }
          });
        this.categories.map((category: any) => {
          category.check = false;
          return category;
        });
      }
    });
  }

    goBack() {
   this.router.navigate([
              '/dashboard/laboratory-profile',
              this.facilityId,
              this.laboratoryId,
            ]);
  }

  getCategory() {
    this.api
      .getFacilityTypeById({
        facilityId: this.facilityId,
        facilityType: FacilityType.Laboratory,
        facilityTypeId: this.laboratoryId,
      } as any)
      .subscribe((res: any) => {
        this.name.setValue(res.name || '');
        this.categories.forEach((category: any) => {
          category.check = res.specializations.includes(category.text);
        });
      });
  }

  proceed() {
    this.loading = true;
    this.label = 'Please Wait';

    const categoriesSelected = this.checkCategorySelected();

    const payload = {
      facilityId: this.facilityId,
      specializations: categoriesSelected,
      name: this.name.value || undefined,
    };

    this.api
      .createFacilityType({
        facilityId: this.facilityId,
        facilityType: FacilityType.Laboratory,
        facilityTypeId: this.laboratoryId,
        body: payload,
      } as any)
      .subscribe({
        next: () => {
          this.loading = false;
          this.label = 'Continue';

          if (this.edit?.length) {
            this.toast.show(
              'Laboratory updated successfully',
              'success'
            );

            this.router.navigate([
              '/dashboard/laboratory-profile',
              this.facilityId,
              this.laboratoryId,
            ]);
          } else {
            this.toast.show(
              'Laboratory created successfully',
              'success'
            );

            this.router.navigate([
              '/dashboard/laboratory-onboarding',
              this.facilityId,
              this.laboratoryId,
              'laboratory-license',
            ]);
          }
        },
        error: (err) => {
          this.loading = false;
          this.label = 'Continue';

          this.toast.show(
            err?.detail || 'Failed to save laboratory details',
            'error'
          );
        },
      });
  }

  selectType(type: any, index: any) {
    this.categories[index].check = !this.categories[index].check;
  }

  checkCategorySelected(): [] {
    const categories: any = [];
    this.categories.forEach((category: any) => {
      if (category.check) {
        categories.push(category.value);
      }
    });
    return categories;
  }
  checkIfAnyIsEmpty(): boolean {
    return this.categories.some((q: any) => q.check === true);
  }
}
