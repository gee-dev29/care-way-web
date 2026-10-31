import { CommonModule,  Location } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, ProfessionalType } from '@healbridge/api';
import { AddNewEntryCard, ToastService } from '@healbridge/ui';
import { IonContent, IonIcon, IonText, IonImg, IonSkeletonText, IonAvatar, IonCard, IonCardContent, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, eye, paperPlaneOutline } from 'ionicons/icons';
import { Observable, tap, map, Subject, takeUntil } from 'rxjs';
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

@Component({
  selector: 'medical-facility-nurse-details',
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
    AddNewEntryCard
  ],
  templateUrl: './nurse-details.html',
  styleUrl: './nurse-details.css',
})
export class NurseDetails implements OnInit, OnDestroy {
  router = inject(Router);
  location = inject(Location);
  loaded = false;
  private activatedRoute = inject(ActivatedRoute);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private destroy$ = new Subject<void>();
  professionalId: string;
  gobackRoute: string;
  professional$: Observable<any>;
  profileInfoService: any = {};
  license$: Observable<any>;
  @ViewChild('modal') modal: IonModal;
  loading$: Observable<boolean>;
  picture: any;
  facilityId: any;
  facilityType: any;
  displayFile = false;
  canDismiss = false;
  physicalConsultationFee: string;
  virtualConsultationFee: string;
  bank:any;
  professionalName: string | null = null;
  hospitalId: string;
  showSendInvitation = false;
  availableHospital = false;
  availableHospitals: FacilityOption[] = [];
  selectedHospital: FacilityOption | null = null;
  selectedHospitalId: string | undefined = undefined;
  isLoadingHospitals = false;
  saving = false;

  ionViewWillEnter() {
    this.loadProfile();
  }
  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.showSendInvitation = !this.router.url.includes('nurse-dashboard');
    if(this.router.url.includes('nurse-dashboard')){
      this.gobackRoute = `/nurse-dashboard/${this.professionalId}/nurse-profile`;
    } else {
       this.gobackRoute = `/dashboard/nurses`;
       this.hospitalId = JSON.parse(
         localStorage.getItem('facilityTypeId') as any
       );
    }
    this.activatedRoute.params.subscribe((params: any) => {

      this.professionalId = params.professionalId;
      this.facilityId = params.facilityId;
      this.facilityType = params.facilityType;
      this.professional$ = this.api
        .getMedicalProfessional({
          professionalId: this.professionalId,
          professionalType: ProfessionalType.Nurse,
        })
        .pipe(
          tap((nurse: any) => {
            this.professionalName = `${nurse?.firstName ?? ''} ${nurse?.lastName ?? ''}`.trim();
          })
        );

      this.license$ = this.api
        .getPracticeLicenses({
          referencedDocumentId: this.professionalId,
        })
        .pipe(map((response: any) => response[0]));
      this.profileInfoService.name = ProfessionalType.Nurse;
      this.api
        .getUploads({ referencedDocumentId: this.professionalId })
        .subscribe((response: any) => {
          this.loaded = true;
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
    this.api
        .getBankAccount({
          referencedDocumentId: this.professionalId,
        })
        .subscribe((res: any) => {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack() {
    this.router.navigateByUrl(this.gobackRoute);
  }

  openConnectModal(): void {
    this.availableHospital = true;
    this.isLoadingHospitals = true;
    this.selectedHospital = null;
    this.selectedHospitalId = undefined;

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
    if (!this.selectedHospitalId || !this.professionalId) {
      return;
    }

    this.saving = true;
    this.api
      .facilityConnectionRequest({
        referencedDocumentId: this.professionalId,
        body: {
          connectionId: v4(),
          facilityTypeId: this.selectedHospitalId,
          connectionType: 'Professional',
          status: 'Pending',
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.saving = false;
          this.toast.show('Invitation sent successfully', 'success');
          this.closeConnectModal();
        },
        error: () => {
          this.saving = false;
          this.toast.show('Unable to send invitation', 'error');
        },
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

 addNew() {
    this.router.navigate(['nurse-dashboard', this.professionalId, 'add-nurse-bank']);
  }

  editBank(bank:any){
    this.router.navigate(['nurse-dashboard', this.professionalId, 'add-nurse-bank', 'edit', bank.bankAccountId]);
  }
  eyeClicked(licenseId: string) {
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

  editDetails(what: string) {
    if(this.router.url.includes('nurse-dashboard')){

    if (what === 'detail') {
      this.router.navigate([
        `nurse-dashboard/${this.professionalId}/edit-nurse/edit`,
      ]);
    } else {
      this.router.navigate([
        'nurse-dashboard',
        this.professionalId,
        'edit-nurse-license',
        2,
      ]);
    }

    }else{

   
    if (what === 'detail') {
      this.router.navigate([
        'dashboard/add-nurse',
        this.facilityType,
        this.facilityId,
        this.professionalId,'edit'
      ]);
    } else {
      this.router.navigate([
        'dashboard/add-nurse-license',
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
     if(this.router.url.includes('nurse-dashboard')){
       this.router.navigate([
      '/nurse-dashboard',
      this.professionalId,'nurse-profile','upload-profile-picture',
    ]);
     }else{
 this.router.navigate([
      '/dashboard/nurse-profile',
      this.facilityType,
      this.facilityId,
      this.professionalId,
      'upload-profile-picture',
    ]);
     }
   
  }
}
