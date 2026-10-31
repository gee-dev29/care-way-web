import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { IonCard, IonCardContent, IonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  ToastService,
  InputComponent,
  Item,
} from '@healbridge/ui';
import { ConversionService, FacilityType } from '@healbridge/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, HospitalCategory as Category } from '@healbridge/api';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'medical-facility-hospital-category',
  imports: [
    ButtonComponent,
    IonText,
    CommonModule,
    IonCard,
    IonCardContent,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './hospital-category.html',
  styleUrl: './hospital-category.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HospitalCategory implements OnInit {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private conversionService = inject(ConversionService);
  facilityId: string;
  hospitalId: string;
  specialization: Item[] = [];
  isClicked = false;
  specializationControl = new FormControl([], Validators.required);
  name = new FormControl('', [Validators.required]);

  constructor() {
    addIcons({ 'chevron-back-outline': chevronBackOutline });
  }

  edit = '';
  loading = false;
  selectedItem: any = [];
  form: FormGroup;
  categories: any = [
    {
      text: 'Primary',
      check: false,
      value: Category.Primary,
    },
    {
      text: 'Secondary',
      check: false,
      value: Category.Secondary,
    },
    {
      text: 'Tertiary',
      check: false,
      value: Category.Tertiary,
    },
  ];
  label = 'Continue';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.hospitalId = params.pharmacyId;
      this.edit = params.edit;
      if (params.edit) {
        this.getCategory();
      } else {
        this.api
          .getFacilityTypesOfFacility({
            facilityId: this.facilityId,
            facilityType: FacilityType.Hospital,
          } as any)
          .subscribe((res: any) => {
            const hospital = res.filter(
              (item: any) => item.facilityType === FacilityType.Hospital
            );

            if (hospital.length === 0) {
              this.name.setValue(`${res[0].facilityName} Hospital 1`);
            } else {
              this.name.setValue(
                `${hospital[0].facilityName} Hospital ${hospital.length + 1}`
              );
            }
          });

        this.categories.map((category: any) => {
          category.check = false;
          return category;
        });
      }
    });

    this.api.getHospitalSpecializations().subscribe((res: any) => {
      this.api.getHospitalSpecializations().subscribe((res: any[]) => {
        this.specialization = res.map((item) => ({
          text: item.name,
          value: item.hospitalSpecializationId,
        }));
      });
    });

    this.form = new FormGroup({
      specializationControl: this.specializationControl,
      name: this.name,
    });
  }

  goBack() {
    this.router.navigate([
      '/dashboard/hospital-profile',
      this.facilityId,
      this.hospitalId,
    ]);
  }
  getCategory() {
    this.api
      .getFacilityTypeById({
        facilityId: this.facilityId,
        facilityType: FacilityType.Hospital,
        facilityTypeId: this.hospitalId,
      } as any)
      .subscribe((res: any) => {
        const specializationNames = res.specializations.map((s: any) => s.name);
        this.form.patchValue({
          specializationControl: specializationNames,
          name: res.name || '',
        });
        this.selectedItem = specializationNames;
        this.categories.forEach((category: any) => {
          category.check = res.category.includes(category.text);
        });
      });
  }

  proceed() {
    // this.loading = true;
    this.label = 'Please Wait';

    const categoriesSelected = this.checkCategorySelected();
    const selectedNames: string[] = this.form.value.specializationControl;

    const specializationIds = this.specialization
      .filter((item) => selectedNames.includes(item.text))
      .map((item) => item.value);

    const payload = {
      facilityId: this.facilityId,
      category: categoriesSelected,
      specializationIds: specializationIds,
      name: this.form.value.name || undefined,
    };

    this.api
      .createFacilityType({
        facilityId: this.facilityId,
        facilityType: FacilityType.Hospital,
        facilityTypeId: this.hospitalId,
        body: payload,
      } as any)
      .subscribe({
        next: () => {
          this.loading = false;
          this.label = 'Continue';

          if (this.edit === 'edit') {
            this.toast.show(
              'Hospital / Clinic details updated successfully',
              'success'
            );

            this.router.navigate([
              '/dashboard/hospital-profile',
              this.facilityId,
              this.hospitalId,
            ]);
          } else {
            this.toast.show(
              'Hospital/ Clinic details created successfully',
              'success'
            );

            this.router.navigate([
              '/dashboard/hospital-onboarding',
              this.facilityId,
              this.hospitalId,
              'hospital-license',
            ]);
          }
        },
        error: (err) => {
          this.loading = false;
          this.label = 'Continue';

          this.toast.show(
            err?.detail || 'Failed to save Hospital / Clinic details',
            'error'
          );
        },
      });
  }

  selectType(type: any, index: any) {
    this.categories.forEach((category: any) => {
      category.check = false;
    });
    this.categories[index].check = !this.categories[index].check;
  }

  checkCategorySelected(): [] {
    let categories: any;
    this.categories.forEach((category: any) => {
      if (category.check) {
        categories = category.value;
      }
    });
    return categories;
  }
  checkIfAnyIsEmpty(): boolean {
    return this.categories.some((q: any) => q.check === true);
  }
  isActiveClicked() {
    this.isClicked = true;
  }
  offActiveClicked() {
    this.isClicked = false;
  }
}
