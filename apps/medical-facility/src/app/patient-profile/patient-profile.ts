import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, AppointmentType } from '@care-way/api';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MedicalAppointmentStatus, ProfessionalType } from '@care-way/api';
import {
  IonContent,
  IonIcon,
  IonModal,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import moment from 'moment';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { FacilityTypeService, LimitSize } from '@care-way/shared';
import { ConfirmationModal, PlusIconComponent, ToastService } from '@care-way/ui';

@Component({
  selector: 'medical-facility-patient-profile',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonSkeletonText,
    CommonModule,
    ReactiveFormsModule,
    PlusIconComponent,
    ConfirmationModal,
  ],
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.css',
})
export class PatientProfile implements OnInit, OnDestroy {
  private router = inject(Router);
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private toast = inject(ToastService);
  @ViewChild('modal') modal: IonModal;
  patientId: string;
  facilityType: string;
  facilityTypeId: string;
  facilityId: string;
  member$: Observable<any>;
  moment = moment;
  loading = false;
  private destroy$ = new Subject<void>();
  successModal = false;
  canDismiss = true;
  activeTab = AppointmentType.Virtual;
  appointments$: Observable<any>;
  status = MedicalAppointmentStatus;
  assignDoctorModal: boolean;
  form: FormGroup;
  isDoctor = false;
  doctor = new FormControl('');
  private formBuilder = inject(FormBuilder);
  doctors$: Observable<any>;
  specializationId: string;
  dateControl = new FormControl(moment().format('YYYY-MM-DD'));
  timeControl = new FormControl(moment().format('HH:mm'));
  appointments: any[] = [];
  private facilityTypeService = inject(FacilityTypeService);
  appointmentType = AppointmentType;
  isNurse = false;
  cancelModal = false;
  appointmentToCancel: any = null;
  professionalId = '';
  statusMap: Record<string, string[]> = {
    Pending: [
      MedicalAppointmentStatus.Pending,
      MedicalAppointmentStatus.AwaitingHospitalConfirmation,
      MedicalAppointmentStatus.AwaitingDoctorAvailability,
    ],
    Confirmed: [
      MedicalAppointmentStatus.AwaitingCustomerPayment,
      MedicalAppointmentStatus.DoctorAvailable,
    ],
    Paid: [MedicalAppointmentStatus.Confirmed],
    Cancelled: [
      MedicalAppointmentStatus.CustomerCancelled,
      MedicalAppointmentStatus.HospitalCancelled,
    ],
  };

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  ionViewWillEnter() {
    this.load();
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.isNurse = this.router.url.includes('nurse-dashboard');

    this.facilityTypeService.facilityType$
      .pipe(takeUntil(this.destroy$))
      .subscribe((type: any) => {
        this.activatedRoute.params.subscribe((params: any) => {
          this.facilityId = params.facilityId;
          this.facilityType = params.facilityType;
          this.facilityTypeId = params.facilityTypeId;
          this.patientId = params.memberId;
          this.professionalId = params.professionalId;
          this.loading = false;
          this.member$ = this.api.getMember({
            memberId: params.memberId,
          });
        });
        this.form = this.formBuilder.group({
          doctor: this.doctor,
        });
        this.getMedicalAppointments();
      });
  }

  getMedicalAppointments() {
    this.appointments$ = this.api
      .getMedicalAppointments({
        memberId: this.patientId,
        facilityTypeId: this.facilityTypeId,
        appointmentType: this.activeTab,
      })
      .pipe(map((response) => response.data));
  }

  setTab(tab: AppointmentType) {
    this.activeTab = tab;
    this.getMedicalAppointments();
  }

  goBack() {
    if (this.isNurse) {
      this.router.navigate(['/nurse-dashboard', this.professionalId, 'patients']);
      return;
    }
    this.router.navigate(['/dashboard/patients']);
  }

  viewAppointment(apt: any) {
    this.router.navigate(['view-appointment', apt.appointmentId, apt.memberId]);
  }

  createAppointment() {
    this.api
      .getProfessionalsInFacilityType({
        facilityTypeId: this.facilityTypeId,
      })
      .subscribe((professionals: any) => {
        if (professionals.length === 0) {
          this.toast.show(
            'Please add a doctor before booking an appointment ',
            'error'
          );
          if (!this.isNurse) {
            this.router.navigate([
              '/dashboard/add-doctor',
              this.facilityType,
              this.facilityId,
            ]);
          }
          return;
        }
        if (this.isNurse) {
          this.router.navigate([
            '/nurse-dashboard',
            this.professionalId,
            'schedule-appointment',
            this.facilityId,
            this.facilityTypeId,
            this.patientId,
          ]);
          return;
        }
        this.router.navigate([
          '/dashboard/schedule-appointment',
          this.facilityType,
          this.facilityId,
          this.facilityTypeId,
          this.patientId,
        ]);
      });
  }

  getDoctors(specializationId: string) {
    this.doctors$ = this.api
      .getMedicalProfessionals({
        professionalType: ProfessionalType.Doctor,
        specializationId,
        limit: LimitSize.DropDown,
      })
      .pipe(
        map((doctors: any) =>
          doctors.data.map((doctor: any) => ({
            text: `${doctor.firstName} ${doctor.lastName}`,
            value: doctor.professionalId,
            isChecked: false,
            ...doctor,
          }))
        )
      );
  }

  onDoctorDropdownItemSelect() {
    this.isDoctor = true;
  }

  getDoctorDropdownValue(event: any) {
    this.isDoctor = false;
  }

  assignDoctor(appointment: any) {
    if (this.isNurse) {
      this.router.navigate([
        '/nurse-dashboard',
        this.professionalId,
        'assign-doctor-to-appointment',
        this.facilityTypeId,
        appointment.appointmentId,
        appointment.memberId,
      ]);
      return;
    }
    this.router.navigate([
      'dashboard/assign-doctor-to-appointment',
      this.facilityType,
      this.facilityId,
      this.facilityTypeId,
      appointment.appointmentId,
      appointment.memberId,
    ]);
  }

  openCancelModal(appointment: any) {
    this.appointmentToCancel = appointment;
    this.cancelModal = true;
  }

  closeCancelModal() {
    this.cancelModal = false;
    this.appointmentToCancel = null;
  }

  confirmCancelAppointment() {
    this.closeCancelModal();
    this.toast.show(
      'Cancelling appointments is not available yet',
      'error'
    );
  }

  getStatus(status: string): string {
    for (const [label, statuses] of Object.entries(this.statusMap)) {
      if (statuses.includes(status)) {
        return label;
      }
    }
    return 'Pending';
  }
  calculateAge(dob: any): number {
    return moment().diff(moment(dob), 'years');
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
