import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  IonCard,
  IonContent,
  IonSkeletonText,
  IonText,
  IonImg,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cubeOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  AddNewEntryCard,
  ConfirmationModal,
  CardIdentityType,
  AppointmentCardPrimary,
  MedicalServiceCard,
  WalletCard,
} from '@care-way/ui';
import { AuthService, FacilityTypeService } from '@care-way/shared';
import {
  ApiService,
  AppointmentType,
  FacilityType,
  MedicalAppointmentStatus,
  ProfessionalType,
} from '@care-way/api';
import moment from 'moment';
import { forkJoin, Observable, of, Subject, takeUntil } from 'rxjs';
import { DashboardIdentitiesListCard } from '@care-way/ui';
@Component({
  standalone: true,
  selector: 'medical-facility-hospital-dashboard',
  imports: [
    IonContent,
    IonText,
    IonSkeletonText,
    CommonModule,
    IonCard,
    IonImg,
    DashboardIdentitiesListCard,
    AddNewEntryCard,
    ConfirmationModal,
    AppointmentCardPrimary,
    MedicalServiceCard,
    WalletCard,
  ],
  templateUrl: './manage-doctors.html',
  styleUrl: './manage-doctors.css',
})
export class ManageDoctors implements OnChanges, OnInit, OnDestroy {
  constructor() {
    addIcons({
      'cube-outline': cubeOutline,
    });
  }
  router = inject(Router);
  loaded = false;
  loading = false;
  calenderImage = '/icons/calendar-icon.svg';
  pendingIcon = '/icons/pending-icon-black.svg';
  paidIcon = '/icons/paid-icon-black.svg';
  deliveredIcon = '/icons/delivered-icon-black.svg';
  cancelledIcon = '/icons/cancel-icon-black.svg';
  doctorsLists: any = [];
  private facilityTypeService = inject(FacilityTypeService);
  private destroy$ = new Subject<void>();
  recentOrders: any = [];
  recentPatients: any = [];
  private auth = inject(AuthService);
  private api = inject(ApiService);
  FacilityType = FacilityType;
  status = MedicalAppointmentStatus;
  facilityTypeId: any;
  requests: any;
  addRecord: any;
  moment = moment;
  facilityId: any;
  @Input() facilityType: any;
  appointments$: Observable<any>;
  medicalService$: Observable<any>;
  appointmentType = AppointmentType;
  modifiedOrder = this.recentOrders.slice(0, 4);
  patients$: Observable<any>;
  doctors$: Observable<any> = of([]);
  nurses$: Observable<any> = of([]);
  type = CardIdentityType;
  facilityTypeInfo: any;
  doctorTotalRecords: number;
  nurseTotalRecords: number;
  patientsTotalRecords: number;
  confirmModal: boolean;
  balance: number | undefined;
  statusMap: Record<string, string[]> = {
    Pending: [
      MedicalAppointmentStatus.Pending,
      MedicalAppointmentStatus.AwaitingHospitalConfirmation,
      MedicalAppointmentStatus.AwaitingDoctorAvailability,
    ],
    Assigned: [MedicalAppointmentStatus.AwaitingCustomerPayment],
    Paid: [MedicalAppointmentStatus.Confirmed],
    Cancelled: [
      MedicalAppointmentStatus.CustomerCancelled,
      MedicalAppointmentStatus.HospitalCancelled,
    ],
  };
  getAuth: any;

  ngOnInit() {
    this.facilityTypeService.facilityType$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.ngOnChanges();
      });

    this.api.getWalletSummary().subscribe({
      next: (res) => {
        this.balance = res.balance;
      },
    });
  }

  ngOnChanges(): void {
    setTimeout(() => {
      this.auth.userDetail(this.api, (auth) => {
        this.getAuth = auth;
        this.facilityId = auth?.userTypeId;
        const facilityType = JSON.parse(
          localStorage.getItem('facilityType') as any
        );
        const facilityTypeId = JSON.parse(
          localStorage.getItem('facilityTypeId') as any
        );
        this.facilityTypeId = facilityTypeId;
        if (facilityType === this.facilityType && this.facilityTypeId != null) {
          this.addRecord = `dashboard/add-doctor/${this.facilityType}/${this.facilityId}`;

          forkJoin({
            facilityTypeInfo: this.api.getFacilityTypeById({
              facilityId: this.facilityId,
              facilityType: this.facilityType,
              facilityTypeId: facilityTypeId,
            }),
            doctors: this.api.getProfessionalsInFacilityType({
              facilityTypeId: this.facilityTypeId,
              professionalType: ProfessionalType.Doctor,
            }),
            nurses: this.api.getProfessionalsInFacilityType({
              facilityTypeId: this.facilityTypeId,
              professionalType: ProfessionalType.Nurse,
            }),
            patients: this.api.getMembersInFacilityType({
              facilityTypeId: this.facilityTypeId,
            }),
            appointments: this.api.getMedicalAppointments({
              facilityTypeId: this.facilityTypeId,
              status: MedicalAppointmentStatus.AwaitingHospitalConfirmation,
              limit: 1,
            }),
            medicalProducts: this.api.getMedicalProducts({
              facilityTypeId: this.facilityTypeId,
              skip: 0,
              limit: 20,
            }),
          }).subscribe({
            next: ({
              facilityTypeInfo,
              doctors,
              nurses,
              patients,
              appointments,
              medicalProducts,
            }: any) => {
              this.facilityTypeInfo = facilityTypeInfo;

              this.doctorTotalRecords = doctors.length;
              this.doctors$ = of(doctors.slice(0, 3));

              this.nurseTotalRecords = nurses.length;
              this.nurses$ = of(nurses.slice(0, 3));

              const newPatients = (patients ?? []).filter(
                (response: any) => response != null
              );
              this.patientsTotalRecords = newPatients.length;
              this.patients$ = of(newPatients.slice(0, 3));

              this.appointments$ = of(appointments?.data?.[0] ?? null);
              this.medicalService$ = of(
                this.toServiceCard(medicalProducts?.data?.[0])
              );

              this.loaded = true;
            },
            error: () => {
              this.loaded = true;
            },
          });
        } else {
          this.loaded = true;
        }
      });
    }, 1000);
  }

  private toServiceCard(service: any) {
    if (!service) {
      return null;
    }
    return {
      name: service.productName,
      amount: `NGN ${Number(service.unitPrice).toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      requiresDelivery: !!service.requiresDelivery,
    };
  }

  getOrderIcon(status: string): string {
    switch (status) {
      case 'pending':
        return this.pendingIcon;
      case 'paid':
        return this.paidIcon;
      case 'delivered':
        return this.deliveredIcon;
      case 'cancelled':
        return this.cancelledIcon;
      default:
        return '/icons/default-icon.svg';
    }
  }

  viewAllRecentOrders() {
    this.router.navigateByUrl('/dashboard/orders');
  }

  viewAllPatients() {
    this.router.navigate(['dashboard/patients']);
  }

  createAppointment() {
    this.router.navigate(['/dashboard/patients']);
  }

  viewAllMedicalAppointments() {
    this.router.navigate([
      'dashboard/list-all-medical-facility-appointments',
      this.facilityType,
      this.facilityId,
      this.facilityTypeId,
      'Pending',
    ]);
  }

  viewAllMedicalServices() {
    this.router.navigate([
      'dashboard/more',
      this.facilityType,
      this.facilityId,
      this.facilityTypeId,
      'view-all-medical-service',
    ]);
  }

  addMedicalService() {
    this.router.navigate([
      'dashboard/more',
      this.facilityType,
      this.facilityId,
      this.facilityTypeId,
      'add-medical-service',
    ]);
  }

  getStatus(status: any): string {
    for (const [label, statuses] of Object.entries(this.statusMap)) {
      if (statuses.includes(status)) {
        return label;
      }
    }
    return 'Pending';
  }

  viewDoctors() {
    this.router.navigate(['/dashboard/doctors']);
  }

  viewPatient(memberId: any) {
    this.router.navigate([
      '/dashboard/patient-profile',
      this.facilityType,
      this.facilityId,
      this.facilityTypeId,
      memberId,
    ]);
  }

  assignDoctor(appointment: any) {
    this.router.navigate([
      'dashboard/assign-doctor-to-appointment',
      this.facilityType,
      this.facilityId,
      this.facilityTypeId,
      appointment.appointmentId,
      appointment.memberId,
    ]);
  }

  routeTo() {
    this.router.navigateByUrl(
      'dashboard/add-patient/Hospital/5d81e56c-50b7-4399-8ca5-58df4f954085/f92895f6-6c80-45c4-85e4-096e5a4eafc3'
    );
  }

  declineRequest(appointment: any) {
    this.confirmModal = true;
  }

  confirmAccept() {
    this.confirmModal = false;
  }

  cancelAccept() {
    this.confirmModal = false;
  }

  addDoctor() {
    this.router.navigate([
      'dashboard/add-doctor',
      this.facilityType,
      this.facilityId,
    ]);
  }

  addNurses() {
    this.router.navigate([
      'dashboard/add-nurse',
      this.facilityType,
      this.facilityId,
    ]);
  }

  addPatient() {
    this.router.navigate([
      'dashboard/add-patient',
      this.facilityType,
      this.facilityId,
      this.facilityTypeId,
    ]);
  }

  viewPatients() {
    this.router.navigateByUrl('dashboard/patients');
  }

  viewNurses() {
    this.router.navigateByUrl('dashboard/nurses');
  }

  viewAppointment(appointment: any) {
    if (appointment.appointmentType === AppointmentType.Physical) {
      this.router.navigate(
        [
          '/dashboard',
          'view-appointment',
          this.facilityType,
          this.facilityId,
          this.facilityTypeId,
          appointment.appointmentId,
          appointment.memberId,
        ],
        {
          queryParams: {
            type: 'physical',
          },
        }
      );
    } else {
      this.router.navigate(
        [
          '/dashboard',
          'view-appointment',
          appointment.appointmentId,
          appointment.memberId,
        ],
        {
          queryParams: {
            type: 'virtual',
          },
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
