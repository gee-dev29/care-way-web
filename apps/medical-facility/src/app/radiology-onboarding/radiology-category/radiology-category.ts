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
  IonIcon,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ButtonComponent, InputComponent, ToastService } from '@healbridge/ui';
import {
  ConversionService,
  DiagnosticRadiology,
  FacilityType,
  InterventionalRadiology,
} from '@healbridge/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronDown, chevronUp } from 'ionicons/icons';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'medical-facility-radiology-category',
  imports: [
    ButtonComponent,
    IonText,
    CommonModule,
    IonCard,
    IonCardContent,
    IonCheckbox,
    IonIcon,
    InputComponent,
  ],
  templateUrl: './radiology-category.html',
  styleUrl: './radiology-category.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RadiologyCategory implements OnInit {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private conversionService = inject(ConversionService);
  facilityId: string;
  radiologyId: string;
  specialization: any = [];
  isClicked = false;
  edit = '';
  loading = false;
  diagnostic = false;
  interventional = false;
  diagnosticCategories: any = [];
  interventionalCategories: any = [];
  label = 'Continue';
  name = new FormControl('', [Validators.required]);

    constructor() {
      addIcons({ 'chevron-back-outline': chevronBackOutline });
    }

  ngOnInit(): void {
    this.conversionService.convert(
      DiagnosticRadiology,
      this.diagnosticCategories
    );
    this.conversionService.convert(
      InterventionalRadiology,
      this.interventionalCategories
    );
    this.diagnosticCategories.map((category: any) => {
      category.check = false;
      return category;
    });
    this.interventionalCategories.map((category: any) => {
      category.check = false;
      return category;
    });
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.radiologyId = params.pharmacyId;
      this.edit = params.edit;
      if (this.edit?.length) {
        this.api
          .getFacilityTypeById({
            facilityId: this.facilityId,
            facilityType: FacilityType.Radiology,
            facilityTypeId: this.radiologyId,
          } as any)
          .subscribe((res: any) => {
            this.name.setValue(res.name || '');
            res.specializations.forEach((each: any) => {
              this.interventionalCategories.forEach((inter: any) => {
                if (each == inter.text) {
                  inter.check = true;
                }
              });
              this.diagnosticCategories.forEach((dia: any) => {
                if (each == dia.text) {
                  dia.check = true;
                }
              });
            });
          });
      } else {
        this.api
          .getFacilityTypesOfFacility({
            facilityId: this.facilityId,
            facilityType: FacilityType.Radiology,
          } as any)
          .subscribe((res: any) => {
            const radiology = res.filter(
              (item: any) => item.facilityType === FacilityType.Radiology
            );

            if (radiology.length === 0) {
              this.name.setValue(`${res[0].facilityName} Radiology 1`);
            } else {
              this.name.setValue(
                `${radiology[0].facilityName} Radiology ${radiology.length + 1}`
              );
            }
          });
      }
    });
    addIcons({ chevronDown, chevronUp });
  }

    goBack() {
  this.router.navigate([
              '/dashboard/radiology-profile',
              this.facilityId,
              this.radiologyId,
            ]);
  }

  proceed() {
    this.loading = true;
    this.label = 'Please Wait';

    const diagnostic = this.checkCategorySelected('diagnostic');
    const interventional = this.checkCategorySelected('interventional');

    const payload = {
      facilityId: this.facilityId,
      specializations: [...diagnostic, ...interventional],
      name: this.name.value || undefined,
    };

    this.api
      .createFacilityType({
        facilityId: this.facilityId,
        facilityType: FacilityType.Radiology,
        facilityTypeId: this.radiologyId,
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
              '/dashboard/radiology-profile',
              this.facilityId,
              this.radiologyId,
            ]);
          } else {
            this.toast.show(
              'Laboratory created successfully',
              'success'
            );

            this.router.navigate([
              '/dashboard/radiology-onboarding',
              this.facilityId,
              this.radiologyId,
              'radiology-license',
            ]);
          }
        },
        error: () => {
          this.loading = false;
          this.label = 'Continue';
        },
      });
  }

  selectType(type: any) {
    if (type == 'diagnostic') {
      this.diagnostic = !this.diagnostic;
      this.interventional = false;
      // this.diagnosticCategories[index].check =
      //   !this.diagnosticCategories[index].check;
    } else {
      this.diagnostic = false;
      this.interventional = !this.interventional;
      // this.interventionalCategories[index].check =
      //   !this.interventionalCategories[index].check;
    }
  }
  selectMyCategory(type: any, index: any) {
    if (type == 'diagnostic') {
      this.diagnosticCategories[index].check =
        !this.diagnosticCategories[index].check;
    } else {
      this.interventionalCategories[index].check =
        !this.interventionalCategories[index].check;
    }
  }

  checkCategorySelected(type: any): [] {
    if (type === 'diagnostic') {
      const categories: any = [];
      this.diagnosticCategories.forEach((category: any) => {
        if (category.check) {
          categories.push(category.value);
        }
      });
      return categories;
    } else {
      const categories: any = [];
      this.interventionalCategories.forEach((category: any) => {
        if (category.check) {
          categories.push(category.value);
        }
      });
      return categories;
    }
  }

  checkIfAnyIsEmpty(type: string): boolean {
    if (type === 'diagnostic') {
      return this.diagnosticCategories.some((q: any) => q.check === true);
    } else {
      return this.interventionalCategories.some((q: any) => q.check === true);
    }
  }
}
