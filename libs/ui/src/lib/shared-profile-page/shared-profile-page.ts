import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  IonText,
  IonIcon,
  IonAvatar,
  IonCard,
  IonImg,
  IonSkeletonText,
  IonModal,
  IonCardContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { forkJoin, map, Observable, shareReplay, startWith } from 'rxjs';
@Component({
  selector: 'ui-shared-profile-page',
  imports: [
    IonText,
    IonIcon,
    IonAvatar,
    IonCard,
    IonImg,
    CommonModule,
    IonSkeletonText,
    IonModal,
    IonCardContent,
  ],
  templateUrl: './shared-profile-page.html',
  styleUrl: './shared-profile-page.css',
})
export class SharedProfilePage implements OnInit {
  @Input() greenBookType: any;
  @Input() facilityType: string;
  @Input() FacilityType: any;
  @Input() route: any;
  @Input() profileInfoService: any;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  @Input() api: any;
  facilityId: string;
  @ViewChild('modal') modal: IonModal;
  pharmacyId: string;
  license$: Observable<any>;
  bank$: Observable<any>;
  address$: Observable<any>;
  category$: Observable<any>;
  loading$: Observable<boolean>;
  patientType$: Observable<any>;
  picture: any;
  displayFile = false;
  canDismiss = false;

  constructor() {
    addIcons({ 'left-arrow': chevronBackOutline });
  }

  ionViewWillEnter() {
    this.loadProfile();
  }

  loadProfile() {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.facilityId = params.facilityId;
      this.pharmacyId =
        params.pharmacyId ??
        params.laboratoryId ??
        params.bloodBankId ??
        params.radiologyId;
      this.getAllData();
      this.profileInfoService.name = this.facilityType;
      this.api
        .getUploads({ referencedDocumentId: this.pharmacyId })
        .subscribe((response: any) => {
          response.forEach((element: any, index: any) => {
            if (
              index == response.length - 1 &&
              element.name == 'Upload Picture'
            ) {
              this.profileInfoService.picture = element.url;
            }
          });
        });
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  editInfo(where: string, id: any) {
    const facilityType = this.facilityType.toLowerCase();
    switch (where) {
      case 'category':
        if (this.facilityType === this.FacilityType.Pharmacy) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'pharm-category',
            'edit',
          ]);
        } else if (this.facilityType === this.FacilityType.Hospital) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'hospital-category',
            'edit',
          ]);
        } else if (this.facilityType === this.FacilityType.Laboratory) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'laboratory-category',
            'edit',
          ]);
        } else if (this.facilityType === this.FacilityType.Radiology) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'radiology-category',
            'edit',
          ]);
        } else if (this.facilityType === this.FacilityType.BloodBank) {
          this.router.navigate([
            `/dashboard/blood-bank-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'blood-bank-list',
            'edit',
          ]);
        }
        break;
      case 'license':
        if (this.facilityType === this.FacilityType.Pharmacy) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'pharm-license',
            'edit',
            id,
          ]);
        } else if (this.facilityType === this.FacilityType.Hospital) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'hospital-license',
            'edit',
            id,
          ]);
        } else if (this.facilityType === this.FacilityType.Laboratory) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'laboratory-license',
            'edit',
            id,
          ]);
        } else if (this.facilityType === this.FacilityType.Radiology) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'radiology-license',
            'edit',
            id,
          ]);
        } else if (this.facilityType === this.FacilityType.BloodBank) {
          this.router.navigate([
            `/dashboard/blood-bank-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'blood-bank-license-details',
            'edit',
            id,
          ]);
        }
        break;
      case 'bank':
        if (this.facilityType === this.FacilityType.Pharmacy) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'pharm-add-bank',
            'edit',
            id,
          ]);
        } else if (this.facilityType === this.FacilityType.Hospital) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'hospital-add-bank',
            'edit',
            id,
          ]);
        } else if (this.facilityType === this.FacilityType.Laboratory) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'laboratory-add-bank',
            'edit',
            id,
          ]);
        } else if (this.facilityType === this.FacilityType.Radiology) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'radiology-add-bank',
            'edit',
            id,
          ]);
        } else if (this.facilityType === this.FacilityType.BloodBank) {
          this.router.navigate([
            `/dashboard/blood-bank-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'blood-bank-add-bank',
            'edit',
            id,
          ]);
        }
        break;

      case 'PatientCardType':
        if (this.facilityType === this.FacilityType.Hospital) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'hospital-add-patient-card-type',
            'edit',
            id,
          ]);
        }
        break;
      default:
        // if (id != 'new') {
        if (this.facilityType === this.FacilityType.Pharmacy) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'pharm-add-address',
            'edit',
            id,
          ]);
        } else if (this.facilityType === this.FacilityType.Hospital) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'hospital-add-address',
            'edit',
            id,
          ]);
        } else if (this.facilityType === this.FacilityType.Laboratory) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'laboratory-add-address',
            'edit',
            id,
          ]);
        } else if (this.facilityType === this.FacilityType.Radiology) {
          this.router.navigate([
            `/dashboard/${facilityType}-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'radiology-add-address',
            'edit',
            id,
          ]);
        } else if (this.facilityType === this.FacilityType.BloodBank) {
          this.router.navigate([
            `/dashboard/blood-bank-onboarding`,
            this.facilityId,
            this.pharmacyId,
            'blood-bank-add-address',
            'edit',
            id,
          ]);
        }
        // }
        // else {
        //   if (this.facilityType === this.FacilityType.Pharmacy) {
        //     this.router.navigate([
        //       `/dashboard/${facilityType}-onboarding`,
        //       this.facilityId,
        //       this.pharmacyId,
        //       'pharm-empty-address',
        //       'patch',
        //     ]);
        //   } else if (this.facilityType === this.FacilityType.Hospital) {
        //     this.router.navigate([
        //       `/dashboard/${facilityType}-onboarding`,
        //       this.facilityId,
        //       this.pharmacyId,
        //       'hospital-empty-address',
        //       'patch',
        //     ]);
        //   } else if (this.facilityType === this.FacilityType.Laboratory) {
        //     this.router.navigate([
        //       `/dashboard/${facilityType}-onboarding`,
        //       this.facilityId,
        //       this.pharmacyId,
        //       'laboratory-empty-address',
        //       'patch',
        //     ]);
        //   } else if (this.facilityType === this.FacilityType.Radiology) {
        //     this.router.navigate([
        //       `/dashboard/${facilityType}-onboarding`,
        //       this.facilityId,
        //       this.pharmacyId,
        //       'radiology-empty-address',
        //       'patch',
        //     ]);
        //   } else if (this.facilityType === this.FacilityType.BloodBank) {
        //     this.router.navigate([
        //       `/dashboard/blood-bank-onboarding`,
        //       this.facilityId,
        //       this.pharmacyId,
        //       'blood-bank-empty-address',
        //       'patch',
        //     ]);
        //   }
        // }

        break;
    }
  }

  newInfo() {
    this.router.navigate([
      `/dashboard/hospital-onboarding`,
      this.facilityId,
      this.pharmacyId,
      'hospital-add-patient-card-type',
      'new',
    ]);
  }
  goBack() {
    this.router.navigateByUrl('dashboard/home');
  }

  getAllData() {
    const request$ = forkJoin({
      license: this.api.getPracticeLicenses({
        referencedDocumentId: this.pharmacyId,
      }),
      bank: this.api.getFacilityTypeBankAccount({
        facilityType: this.facilityType,
        facilityTypeId: this.pharmacyId,
      }),
      address: this.api
        .getFacilityTypeById({
          facilityId: this.facilityId,
          facilityType: this.facilityType,
          facilityTypeId: this.pharmacyId,
        })
        .pipe(map((res: any) => res.address)),
      category: this.api.getFacilityTypeById({
        facilityId: this.facilityId,
        facilityType: this.facilityType,
        facilityTypeId: this.pharmacyId,
      }),
      patientType: this.api.getFacilityTypeMembershipCardTypes({
        facilityTypeId: this.pharmacyId,
      }),
    }).pipe(shareReplay(1));

    this.license$ = request$.pipe(map((res) => res.license));
    this.bank$ = request$.pipe(map((res) => res.bank));
    this.category$ = request$.pipe(map((res) => res.category));
    this.patientType$ = request$.pipe(map((res) => res.patientType));
    this.address$ = request$.pipe(map((res) => res.address));

    this.loading$ = request$.pipe(
      map(() => false),
      startWith(true)
    );
  }

  async viewLicense(licenseId: string) {
    this.api
      .getUploads({ referencedDocumentId: licenseId })
      .subscribe((res: any) => {
        this.canDismiss = true;
        this.modal.dismiss(null, 'close');
        this.picture = res[res.length - 1].url;
        this.canDismiss = false;
        this.displayFile = true;
      });
  }

  async closeSave() {
    this.displayFile = false;
    this.canDismiss = true;
    await this.modal.dismiss(null, 'close');
    this.canDismiss = false;
  }

  upload() {
    this.router.navigateByUrl(this.route);
  }
}
