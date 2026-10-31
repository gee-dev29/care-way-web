import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, ProfessionalType } from '@healbridge/api';
import { NurseActiveFacility } from '@healbridge/shared';
import { ToastService } from '@healbridge/ui';
import { AddNewEntryCard, FeeCard, FeeListCard } from '@healbridge/ui';
import { FeeFormModal } from '../../fee-form-modal/fee-form-modal';
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonImg,
  IonModal,
  IonSkeletonText,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, eye, paperPlaneOutline } from 'ionicons/icons';
import {
  concatMap,
  finalize,
  map,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { v4 } from 'uuid';

interface FacilityOption {
  facilityId?: string;
  hospitalId?: string;
  facilityName?: string;
  name?: string;
  facilityType?: string;
  address?: {
    city?: string;
    state?: string;
  } | null;
}

interface UploadItem {
  name?: string;
  url?: string;
}

@Component({
  selector: 'medical-facility-doctor-profile',
  imports: [
    IonContent,
    IonIcon,
    IonText,
    IonImg,
    IonSkeletonText,
    CommonModule,
    IonAvatar,
    IonModal,
    IonCard,
    IonCardContent,
    AddNewEntryCard,
    FeeCard,
    FeeListCard,
    FeeFormModal,
  ],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})
export class DoctorProfile implements OnInit, OnDestroy {
  router = inject(Router);
  location = inject(Location);
  loaded = false;
  private activatedRoute = inject(ActivatedRoute);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private nurseActiveFacility = inject(NurseActiveFacility);
  professionalId = '';
  nurseProfessionalId = '';
  gobackRoute = '';
  professional$: Observable<any>;
  profileInfoService: any = {};
  license$: Observable<any>;
  facilityFee$: Observable<any>;
  @ViewChild('modal') modal: IonModal;
  loading$: Observable<boolean>;
  picture: string | null = null;
  facilityId = '';
  facilityType = '';
  displayFile = false;
  canDismiss = false;
  physicalConsultationFee: string | null = null;
  virtualConsultationFee: string | null = null;
  bank: any;
  feeObject: any;
  isThisDoctorModule = false;
  availableHospital = false;
  availableHospitals: FacilityOption[] = [];
  selectedHospital: FacilityOption | null = null;
  selectedHospitalId: string | undefined = undefined;
  isLoadingHospitals = false;
  isModalOpen = false;
  saving = false;
  selectedFee: any = null;
  professionalFee: any = null;
  viewedFee: any = null;
  hospitalId: string;
  professionalName: string | null = null;
  isNurse = false;

  ionViewWillEnter() {
    this.loadProfile();
  }
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfile(): void {
    this.isThisDoctorModule = this.router.url.includes('doctor-dashboard');
    this.isNurse = this.router.url.includes('nurse-dashboard');
    this.profileInfoService.name = ProfessionalType.Doctor;

    const params$ = this.activatedRoute.params.pipe(
      tap((params: Params) => {
        this.professionalId = this.isNurse
          ? params['doctorId']
          : params['professionalId'];
        this.nurseProfessionalId = this.isNurse ? params['professionalId'] : '';
        this.facilityId = this.isNurse
          ? this.nurseActiveFacility.getActiveFacilityId() ?? ''
          : params['facilityId'];
        this.facilityType = params['facilityType'];

        this.gobackRoute = this.isThisDoctorModule
          ? `/doctor-dashboard/${this.professionalId}/doctor-profile`
          : `/dashboard/doctors`;
        this.hospitalId = this.isNurse
          ? this.nurseActiveFacility.getActiveFacilityTypeId() ?? ''
          : JSON.parse(localStorage.getItem('facilityTypeId') as any);
      }),
      // shareReplay(1),
      takeUntil(this.destroy$)
    );

    this.professional$ = params$.pipe(
      switchMap(() =>
        this.api
          .getMedicalProfessional({
            professionalId: this.professionalId,
            professionalType: ProfessionalType.Doctor,
          })
          .pipe(
            tap((res: any) => {
              this.professionalName = `${res?.firstName} ${res?.lastName}`;
            })
          )
      )
    );

    this.facilityFee$ = this.isThisDoctorModule
      ? of(null)
      : params$.pipe(
          switchMap(() =>
            this.api.getFacilityTypesOfFacility({
              facilityId: this.facilityId || '',
            })
          ),
          switchMap((facilityTypes: any) => {
            const facilities = this.getFacilitiesForFee(facilityTypes);
            const matched = facilities.find(
              (facility) => facility.hospitalId === this.hospitalId
            );

            return matched?.hospitalId
              ? this.api.getMedicalProfessionalFee({
                  professionalId: this.professionalId,
                  facilityTypeId: matched.hospitalId,
                })
              : of(null);
          }),
          map((res: any) => res?.data?.[0] ?? null),
          tap((fee: any) => {
            this.professionalFee = fee;
          })
        );

    this.license$ = params$.pipe(
      switchMap(() =>
        this.api.getPracticeLicenses({
          referencedDocumentId: this.professionalId,
        })
      ),
      map((response: any[]) => response[0])
    );

    params$
      .pipe(
        switchMap(() =>
          this.api.getUploads({ referencedDocumentId: this.professionalId })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((response: UploadItem[]) => {
        this.loaded = true;
        response.forEach((element: UploadItem, index: number) => {
          if (
            index === response.length - 1 &&
            element.name === 'Upload Picture'
          ) {
            this.profileInfoService.picture = element.url;
          }
        });
      });

    params$
      .pipe(
        switchMap(() =>
          this.api.getBankAccount({ referencedDocumentId: this.professionalId })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((res: any[]) => {
        this.bank = res.length > 0 ? res[0] : null;
      });
  }

  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'eye-outline': eye,
      'paper-plane-outline': paperPlaneOutline,
    });
  }

  goBack() {
    if (this.isNurse) {
      history.back();
      return;
    }
    this.router.navigateByUrl(this.gobackRoute);
  }

  openConnectModal(): void {
    this.availableHospital = true;
    this.isLoadingHospitals = true;
    this.selectedHospital = null;
    this.selectedHospitalId = undefined;

    // if (this.isNurse) {
    //   this.hospitalId =
    //     this.nurseActiveFacility.getActiveFacilityTypeId() ?? '';
    //   this.facilityId = this.nurseActiveFacility.getActiveFacilityId() ?? '';
    // }

    this.api
      .getFacilityTypesOfFacility({ facilityId: this.facilityId || '' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.availableHospitals = this.normalizeFacilityOptions(res);
          this.isLoadingHospitals = false;
        },
        error: () => {
          this.availableHospitals = [];
          this.isLoadingHospitals = false;
        },
      });
  }

  selectHospital(hospital: FacilityOption): void {
    this.selectedHospital = hospital;
    this.selectedHospitalId = hospital.hospitalId;
  }

  closeConnectModal(): void {
    this.availableHospital = false;
  }

  onDismiss(): void {
    this.availableHospital = false;
  }

  sendVerification(): void {
    this.selectedFee = this.professionalFee
      ? { ...this.professionalFee, feeId: undefined }
      : null;
    this.isModalOpen = true;

    if (!this.selectedHospitalId) {
      return;
    }

    this.closeConnectModal();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedFee = null;
  }

  openFeeDetails(fee: any): void {
    this.viewedFee = fee;
  }

  closeFeeDetails(): void {
    this.viewedFee = null;
  }

  saveFee(formValue: any): void {
    if (!this.selectedHospitalId || !this.professionalId) {
      return;
    }

    this.saving = true;
    this.api
      .createMedicalProfessionalFee({
        professionalId: this.professionalId,
        facilityTypeId: this.selectedHospitalId,
        body: {
          feeId: formValue.feeId,
          facilityTypeId: this.selectedHospitalId,
          professionalId: this.professionalId,

          physicalHospitalFee: Number(formValue.physicalHospitalFee),
          physicalConsultationFee: Number(formValue.physicalConsultationFee),
          physicalConsultationSettlement:
            formValue.physicalConsultationSettlement,
          virtualConsultation: formValue.virtualConsultation,

          ...(formValue.virtualConsultation && {
            virtualConsultationFee: Number(formValue.virtualConsultationFee),
            virtualHospitalFee: Number(formValue.virtualHospitalFee),
            virtualConsultationSettlement:
              formValue.virtualConsultationSettlement,
          }),
        } as any,
      })
      .pipe(
        concatMap(() =>
          this.api.facilityConnectionRequest({
            referencedDocumentId: this.professionalId,
            body: {
              connectionId: v4(),
              facilityTypeId: this.selectedHospitalId,
              connectionType: 'Professional',
              status: 'Pending',
            },
          })
        ),
        tap(() => {
          this.toast.show('Invitation sent successfully', 'success');
          this.closeModal();
        }),
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe({
        next: () => {
          this.loadProfile();
        },
        error: () => {
          this.toast.show('Unable to save fee', 'error');
        },
      });
  }

  addNew() {
    this.router.navigate([
      'doctor-dashboard',
      this.professionalId,
      'add-doctor-bank',
    ]);
  }

  editBank(bank: { bankAccountId?: string }) {
    this.router.navigate([
      'doctor-dashboard',
      this.professionalId,
      'add-doctor-bank',
      'edit',
      bank.bankAccountId,
    ]);
  }
  eyeClicked(licenseId: string) {
    this.api
      .getUploads({ referencedDocumentId: licenseId })
      .subscribe((res: UploadItem[]) => {
        this.canDismiss = true;
        this.modal.dismiss(null, 'close');
        this.picture = res[res.length - 1]?.url ?? null;
        this.canDismiss = false;
        this.displayFile = true;
      });
  }

  editDetails(what: string) {
    if (this.router.url.includes('doctor-dashboard')) {
      if (what === 'detail') {
        this.router.navigate([
          `doctor-dashboard/${this.professionalId}/edit-doctor/edit`,
        ]);
      } else {
        this.router.navigate([
          'doctor-dashboard',
          this.professionalId,
          'edit-doctor-license',
          2,
        ]);
      }
    } else {
      if (what === 'detail') {
        this.router.navigate([
          'dashboard/add-doctor',
          this.facilityType,
          this.facilityId,
          this.professionalId,
          'edit',
        ]);
      } else {
        this.router.navigate([
          'dashboard/add-doctor-license',
          this.facilityType,
          this.facilityId,
          this.professionalId,
          'edit',
        ]);
      }
    }
  }

  async closeSave() {
    this.displayFile = false;
    this.canDismiss = true;
    await this.modal.dismiss(null, 'close');
    this.canDismiss = false;
  }

  upload() {
    if (this.isNurse) {
      return;
    }
    if (this.router.url.includes('doctor-dashboard')) {
      this.router.navigate([
        '/doctor-dashboard',
        this.professionalId,
        'doctor-profile',
        'upload-profile-picture',
      ]);
    } else {
      this.router.navigate([
        '/dashboard/doctor-profile',
        this.facilityType,
        this.facilityId,
        this.professionalId,
        'upload-profile-picture',
      ]);
    }
  }

  private getFacilitiesForFee(response: any): FacilityOption[] {
    const facilities = Array.isArray(response) ? response : [];

    return facilities.filter((facility: any) => {
      const hospitalId = facility?.hospitalId;
      const isHospital = facility?.facilityType === 'Hospital';
      const hasIdentifier = Boolean(hospitalId);

      return isHospital && hasIdentifier;
    });
  }

  private normalizeFacilityOptions(response: any): FacilityOption[] {
    const facilities = Array.isArray(response) ? response : [];

    return facilities.filter((facility: any) => {
      const hospitalId = facility?.hospitalId;
      const isHospital = facility?.facilityType === 'Hospital';
      const isCurrentFacility = hospitalId !== this.hospitalId;
      const hasIdentifier = Boolean(hospitalId);

      return isHospital && hasIdentifier && isCurrentFacility;
    });
  }
}
