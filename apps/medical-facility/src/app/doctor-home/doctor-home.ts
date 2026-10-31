import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, MedicalAppointmentStatus } from '@care-way/api';
import {
  AuthService,
  DocumentStatus,
  ProfileInfoService,
} from '@care-way/shared';
import {
  AddNewEntryCard,
  ButtonComponent,
  CardIdentityType,
  ConfirmationModal,
  DashboardIdentitiesListCard,
  InputTextarea,
  ToastService,
  AppointmentCardPrimary,
  WalletCard,
} from '@care-way/ui';
import {
  IonIcon,
  IonModal,
  IonSkeletonText,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, closeOutline } from 'ionicons/icons';
import { forkJoin, map, Observable, of } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'medical-facility-doctor-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonIcon,
    IonModal,
    IonText,
    IonSkeletonText,
    ConfirmationModal,
    ButtonComponent,
    InputTextarea,
    DashboardIdentitiesListCard,
    AddNewEntryCard,
    AppointmentCardPrimary,
    WalletCard,
  ],
  templateUrl: './doctor-home.html',
  styleUrl: './doctor-home.css',
})
export class DoctorHome implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  public profileInfoService: any = inject(ProfileInfoService);

  isLoading = false;
  professionalId!: string;
  balance: number | undefined = 0;
  appointmentRequests$: Observable<any>;
  hospitals$: Observable<any>;
  invitations: any[] = [];
  appointment: any = [];
  confirmationModal = false;
  appointmentId: string;
  type = CardIdentityType;
  moment = moment;

  inviteConfirmModal = false;
  selectedInvite: any = null;

  rejectModal = false;
  rejecting = false;
  rejectTargetInvite: any = null;
  reasonControl = new FormControl('');

  constructor() {
    addIcons({ chevronForwardOutline, closeOutline });
  }

  ngOnInit() {
    this.auth.userDetail(this.api, (auth) => {
      this.profileInfoService.name = auth?.name as string;
    });
    this.activatedRoute.params.subscribe((params: any) => {
      this.professionalId = params.professionalId;
      this.loadDashboard(params.professionalId);
    });
  }

  loadDashboard(professionalId: string) {
    this.isLoading = true;

    forkJoin({
      balance: this.api.getWalletSummary(),
      hospitals: this.api.getFacilityTypesProfessionalConnection({
        professionalId,
      }),
      invitations: this.api.getAllConnectionRequest({
        referencedDocumentId: professionalId,
      }),
      appointments: this.api.getMedicalAppointments({ professionalId }),
      appointmentRequests: this.api
        .getMedicalAppointmentRequests({
          professionalId,
          status: MedicalAppointmentStatus.Pending,
          limit: 1,
        })
        .pipe(map((requests) => requests.data)),
    }).subscribe({
      next: ({
        balance,
        hospitals,
        invitations,
        appointments,
        appointmentRequests,
      }: any) => {
        this.balance = balance.balance;
        this.hospitals$ = of(hospitals);
        this.invitations = (invitations ?? []).filter(
          (inv: any) => inv.status === 'Pending'
        );
        this.appointment = appointments?.data?.find(
          (x: any) => x.status === 'Confirmed'
        );
        this.appointmentRequests$ = of(appointmentRequests);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  getWalletBalance() {
    this.api.getWalletSummary().subscribe({
      next: (res: any) => {
        this.balance = res.balance;
      },
    });
  }

  getMedicalAppointmentRequests(professionalId: string) {
    this.appointmentRequests$ = this.api
      .getMedicalAppointmentRequests({
        professionalId,
        status: MedicalAppointmentStatus.Pending,
        limit: 1,
      })
      .pipe(map((requests) => requests.data));
  }

  declineRequest(id: string) {
    this.appointmentId = id;
    this.confirmationModal = true;
  }

  declineAppointment() {
    this.api
      .updateProfessionalAppointmentRequest({
        appointmentId: this.appointmentId,
        body: {
          professionalId: this.professionalId,
          status: DocumentStatus.Declined,
        },
      })
      .subscribe((res: any) => {
        this.confirmationModal = false;
        this.getMedicalAppointmentRequests(this.professionalId);
      });
  }
  closeModal() {
    this.confirmationModal = false;
  }

  confirmInvitation(inv: any) {
    this.selectedInvite = inv;
    this.inviteConfirmModal = true;
  }

  confirmAcceptInvite() {
    this.inviteConfirmModal = false;
    if (!this.selectedInvite) {
      return;
    }
    this.acceptInvite(this.selectedInvite);
  }

  cancelAcceptInvite() {
    this.inviteConfirmModal = false;
    this.selectedInvite = null;
  }

  acceptInvite(inv: any) {
    this.api
      .updateFacilityConnectionRequest({
        referencedDocumentId: this.professionalId,
        body: {
          connectionId: inv.connectionId,
          status: 'Approved',
        },
      })
      .subscribe((res: any) => {
        this.api
          .connectProfessionalToFacilityType({
            facilityTypeId: inv.facilityTypeId,
            professionalId: this.professionalId,
            body: {
              connectionId: inv.connectionId,
            },
          })
          .subscribe((res: any) => {
            this.toast.show('Invitation approved', 'success');
            this.getInvitations();
            this.getHospitals();
          });
      });
  }

  rejectInvite(inv: any) {
    this.rejectTargetInvite = inv;
    this.reasonControl.reset('');
    this.rejectModal = true;
  }

  closeReject() {
    this.rejectModal = false;
    this.rejectTargetInvite = null;
    this.reasonControl.reset('');
  }

  submitReject() {
    const reason = (this.reasonControl.value ?? '').trim();
    if (!reason || !this.rejectTargetInvite) {
      return;
    }

    this.rejecting = true;
    this.api
      .updateFacilityConnectionRequest({
        referencedDocumentId: this.professionalId,
        body: {
          connectionId: this.rejectTargetInvite.connectionId,
          status: 'Rejected',
          reason: reason,
        } as any,
      })
      .subscribe({
        next: () => {
          this.rejecting = false;
          this.toast.show('Invitation Rejected', 'success');
          this.closeReject();
          this.getInvitations();
        },
        error: () => {
          this.rejecting = false;
          this.toast.show('Unable to reject invitation', 'error');
        },
      });
  }

  getHospitals() {
    this.hospitals$ = this.api.getFacilityTypesProfessionalConnection({
      professionalId: this.professionalId,
    });
  }

  getInvitations() {
    this.api
      .getAllConnectionRequest({ referencedDocumentId: this.professionalId })
      .subscribe((res: any) => {
        this.invitations = (res ?? []).filter(
          (inv: any) => inv.status === 'Pending'
        );
      });
  }

  getAppointment() {
    this.api
      .getMedicalAppointments({ professionalId: this.professionalId })
      .subscribe((res: any) => {
        this.appointment = res?.data?.find(
          (x: any) => x.status === 'Confirmed'
        );
      });
  }

  viewAllHospital() {
    this.router.navigate([
      '/doctor-dashboard',
      this.professionalId,
      'doctor-available-hospital',
    ]);
  }

  viewAllAppointments() {
    this.router.navigate(
      [
        '/doctor-dashboard',
        this.professionalId,
        'doctor-available-appointments',
      ],
      {
        queryParams: {
          tab: 'Confirmed',
        },
      }
    );
  }

  viewAppointment(a: any) {
    this.router.navigate([
      '/doctor-dashboard',
      this.professionalId,
      'view-appointment',
      a.appointmentId,
      a.memberId,
    ]);
  }

  viewAllAppointmentRequests() {
    this.router.navigate([
      'doctor-dashboard',
      this.professionalId,
      'list-all-professional-appointment-requests',
    ]);
  }

  viewAllInvitations() {
    this.router.navigate([
      '/doctor-dashboard',
      this.professionalId,
      'doctor-available-invitations',
    ]);
  }

  acceptRequest(appointmentRequest: any) {
    this.router.navigate([
      'doctor-dashboard',
      this.professionalId,
      'accept-professional-request',
      appointmentRequest.appointmentId,
    ]);
  }
}
