import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, Facility, FacilityType } from '@healbridge/api';
import {
  HospitalCategoryDetailsCard,
  MedicalFacilityDetailsCard,
  PageBody,
  PageHighlight,
  SplitButtonComponent,
  Tab,
} from '@healbridge/ui';
import { SplitButtonModule } from 'primeng/splitbutton';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'back-office-medical-facility-details',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    PageBody,
    Tab,
    PageHighlight,
    MedicalFacilityDetailsCard,
    SplitButtonComponent,
    SplitButtonModule,
    HospitalCategoryDetailsCard,
  ],
  templateUrl: './medical-facility-details.html',
  styleUrl: './medical-facility-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MedicalFacilityDetails implements OnInit {
  public api = inject(ApiService);
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute);
  activeTab = 0;
  virtualConsultation: any;
  medicalFacility$: Observable<any>;
  hospitalCategory$: Observable<any>;
  medicalFacilityDetails$: Observable<any>;
  facilityName: string;
  facilityEmail: string | undefined;
  items: any = [];
  label = 'Actions';
  activeOnboardForm: string | null = null;
  currentMenu$ = new BehaviorSubject<string>('Details');
  selectedMenu$ = new BehaviorSubject<string>('');
  facilityId: string;
  facilityTypeId: string;
  hospitalId: string;
  totalRecords = 0;
  // pharmacyId: string;
  userTypeId: string;
  tabToFacilityType: Record<number, FacilityType> = {
    1: FacilityType.Hospital,
    2: FacilityType.Pharmacy,
    3: FacilityType.Laboratory,
    4: FacilityType.BloodBank,
    5: FacilityType.Radiology,
  };

  tabs = [
    { title: 'Details', value: 0, content: 'Details' },
    { title: 'Hospitals', value: 1, content: 'Hospitals' },
    { title: 'Pharmacies', value: 2, content: 'Pharmacies' },
    { title: 'Laboratories', value: 3, content: 'Laboratories' },
    { title: 'Blood Banks', value: 4, content: 'Blood Banks' },
    { title: 'Radiology Centres', value: 5, content: 'Radiology Centres' },
  ];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.facilityId = params.facilityId;
      this.getMedicalFacility(params.facilityId);
      this.getHospitalCategory();
    });
    this.items = this.getDefaultItems();
    this.selectedMenu$.subscribe((menu) => {
      this.handleMenuSelection(menu);
    });
  }

  view(item: any) {
  this.router.navigate([
    `/${item.facilityType.toLowerCase().replace(/\s+/g, '-')}-details`,
    item.facilityId,
    item.hospitalId ||
      item.pharmacyId ||
      item.laboratoryId ||
      item.bloodBankId ||
      item.radiologyId,
    item.facilityType,
  ]);
}

  showVirtual() {
    //
  }
  setActiveTab(tab: number) {
    this.activeTab = tab;
    this.getCategoryDetails();

    switch (tab) {
      case 0:
        this.label = 'Actions';
        this.activeOnboardForm = null;
        this.items = this.getDefaultItems();
        break;

      case 1:
        this.label = 'Hospital Actions';
        this.activeOnboardForm = null;
        this.items = this.getHospitalItems();
        break;

      case 2:
        this.label = 'Pharmacy Actions';
        this.activeOnboardForm = null;
        this.items = this.getPharmacyItems();
        break;
      case 3:
        this.label = 'Laboratory Actions';
        this.activeOnboardForm = null;
        this.items = this.getLaboratoryItems();
        break;
      case 4:
        this.label = 'Blood-Bank Actions';
        this.activeOnboardForm = null;
        this.items = this.getBloodBankItems();
        break;
      case 5:
        this.label = 'Radiology Actions';
        this.activeOnboardForm = null;
        this.items = this.getRadiologyItems();
        break;

      default:
        this.activeOnboardForm = null;
    }
  }
  getDefaultItems() {
    return [
      {
        label: 'Onboard Hospital',
        command: () => {
          this.label = 'Onboard Hospital';
          this.selectedMenu$.next('OnboardHospital');
        },
      },
      {
        label: 'Onboard Pharmacy',
        command: () => {
          this.label = 'Onboard Pharmacy';
          this.selectedMenu$.next('OnboardPharmacy');
        },
      },
      {
        label: 'Onboard Laboratory',
        command: () => {
          this.label = 'Onboard Laboratory';
          this.selectedMenu$.next('OnboardLaboratory');
        },
      },
      {
        label: 'Onboard Blood Bank',
        command: () => {
          this.label = 'Onboard Blood Bank';
          this.selectedMenu$.next('OnboardBloodBank');
        },
      },
      {
        label: 'Onboard Radiology',
        command: () => {
          this.label = 'Onboard Radiology';
          this.selectedMenu$.next('OnboardRadiology');
        },
      },
    ];
  }

  getHospitalItems() {
    return [
      {
        label: 'Add License',
        command: () => {
          // this.hospitalActiveTab = 1;
          // this.getLicense();
        },
      },
      {
        label: 'Add Bank Account',
        command: () => {
          // this.hospitalActiveTab = 2;
          // this.getBankAccount();
        },
      },
      {
        label: 'Add Address',
        command: () => {
          // this.hospitalActiveTab = 3;
          // this.getAddresses();
        },
      },
      {
        label: 'Add Patient Card Type',
        command: () => {
          // this.hospitalActiveTab = 4;
          // this.getPatientCardType();
        },
      },
    ];
  }

  getPharmacyItems() {
    return [
      {
        label: 'Add License',
        command: () => {
          // this.pharmacyActiveTab = 1;
          // this.getLicense();
        },
      },
      {
        label: 'Add Bank Account',
        command: () => {
          // this.pharmacyActiveTab = 2;
        },
      },
      {
        label: 'Add Address',
        command: () => {
          // this.pharmacyActiveTab = 3;
        },
      },
    ];
  }
  getLaboratoryItems() {
    return [
      {
        label: 'Add License',
        command: () => {
          // this.laboratoryActiveTab = 1;
          // this.getLicense();
        },
      },
      {
        label: 'Add Bank Account',
        command: () => {
          // this.laboratoryActiveTab = 2;
        },
      },
      {
        label: 'Add Address',
        command: () => {
          // this.laboratoryActiveTab = 3;
        },
      },
    ];
  }
  getBloodBankItems() {
    return [
      {
        label: 'Add License',
        command: () => {
          // this.bloodBankActiveTab = 1;
          // this.getLicense();
        },
      },
      {
        label: 'Add Bank Account',
        command: () => {
          // this.bloodBankActiveTab = 2;
        },
      },
      {
        label: 'Add Address',
        command: () => {
          // this.bloodBankActiveTab = 3;
        },
      },
    ];
  }
  getRadiologyItems() {
    return [
      {
        label: 'Add License',
        command: () => {
          // this.radiologyActiveTab = 1;
          // this.getLicense();
        },
      },
      {
        label: 'Add Bank Account',
        command: () => {
          // this.radiologyActiveTab = 2;
        },
      },
      {
        label: 'Add Address',
        command: () => {
          // this.radiologyActiveTab = 3;
        },
      },
    ];
  }

  handleMenuSelection(menu: string) {
    switch (menu) {
      case 'OnboardHospital':
        this.activeOnboardForm = 'Hospital';
        break;

      case 'OnboardPharmacy':
        this.activeOnboardForm = 'Pharmacy';
        break;

      case 'OnboardLaboratory':
        this.activeOnboardForm = 'Laboratory';
        break;

      case 'OnboardBloodBank':
        this.activeOnboardForm = 'BloodBank';
        break;

      case 'OnboardRadiology':
        this.activeOnboardForm = 'Radiology';
        break;

      default:
        this.activeOnboardForm = null;
    }
  }

  show() {
    //
  }

  getMedicalFacility(facilityId: string) {
    this.medicalFacility$ = this.api
      .getFacility({ facilityId: facilityId })
      .pipe(
        tap((facility: Facility) => {
          this.facilityName = `${facility.name}`;
          this.facilityEmail = facility.email;
        })
      );
  }

  getHospitalCategory() {
    this.hospitalCategory$ = this.api
      .getFacilityTypesOfFacility({
        facilityId: this.facilityId,
      })
      .pipe(
        map((facilities: any) =>
          facilities.filter(
            (f: { facilityType: string }) => f.facilityType === 'Hospital'
          )
        ),

        tap((hospitals: any[]) => {
          if (hospitals?.length) {
            this.hospitalId = hospitals[0].hospitalId;
          }
        }),

        switchMap((hospitals: any[]) =>
          this.api.getHospitalSpecializations().pipe(
            map((specializations: any[]) =>
              hospitals.map((hospital) => {
                const names = specializations
                  .filter((s) =>
                    hospital.specializationIds?.includes(
                      s.hospitalSpecializationId
                    )
                  )
                  .map((s) => s.name);

                return {
                  ...hospital,
                  specializationNames: names.join(', '),
                };
              })
            )
          )
        )
      );
  }

  onFacilityDataSave(event: { id: string; facilityType: string }) {
    const { id, facilityType } = event;
    // this.userTypeId = id;
    if (facilityType === FacilityType.Pharmacy) {
      this.activeTab = 2;
      // this.pharmacyActiveTab = 0;
      this.getCategoryDetails();
      // this.pharmacyId = id;
    }
  }

  getCategoryDetails() {
    const tabToId: Record<number, string> = {
      0: '',
      1: 'hospitalId',
      2: 'pharmacyId',
      3: 'laboratoryId',
      4: 'bloodBankId',
      5: 'radiologyId',
    };

    const facilityType =
      this.tabToFacilityType[this.activeTab] || FacilityType.Hospital;

    this.medicalFacilityDetails$ = this.api
      .getFacilityTypesOfFacility({ facilityId: this.facilityId })
      .pipe(
        map((facilities: any[]) =>
          facilities.filter((f: any) => f.facilityType === facilityType)
        ) as any,
        tap((response: any[]) => {
          this.totalRecords = response.length;
          if (response?.length) {
            this.userTypeId = response[0][tabToId[this.activeTab]];
          }
        }),

        switchMap((hospitals: any[]) => {
          if (facilityType !== FacilityType.Hospital) {
            return of(
              hospitals.map((f: any) => ({
                ...f,
                specializationNames:
                  f.specializations?.slice(0, 3)?.join(', ') ?? '',
                productCategories:
                  f.productCategories?.slice(0, 3)?.join(', ') ?? '',
                bloodProducts: f.bloodProducts?.slice(0, 3)?.join(', ') ?? '',
              }))
            );
          }
          return this.api.getHospitalSpecializations().pipe(
            map((specializations: any[]) =>
              hospitals.map((hospital) => {
                const specializationNames = specializations
                  .filter((s) =>
                    hospital.specializationIds?.includes(
                      s.hospitalSpecializationId
                    )
                  )
                  .map((s) => s.name)
                  .slice(0, 3)
                  .join(', ');

                return {
                  ...hospital,
                  specializationNames,
                };
              })
            )
          );
        })
      );
  }
}
