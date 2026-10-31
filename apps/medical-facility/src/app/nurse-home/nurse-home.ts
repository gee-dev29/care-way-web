import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, ProfessionalType } from '@healbridge/api';
import { NurseActiveFacility } from '@healbridge/shared';
import {
  AddNewEntryCard,
  AppointmentCardPrimary,
  ButtonComponent,
  ConfirmationModal,
  InputTextarea,
  ToastService,
} from '@healbridge/ui';
import {
  IonIcon,
  IonModal,
  IonSkeletonText,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  chevronForwardOutline,
  closeOutline,
  timeOutline,
} from 'ionicons/icons';
import moment from 'moment';
import { distinctUntilChanged, forkJoin, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-nurse-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonIcon,
    IonModal,
    IonText,
    IonSkeletonText,
    AddNewEntryCard,
    AppointmentCardPrimary,
    ConfirmationModal,
    ButtonComponent,
    InputTextarea,
  ],
  templateUrl: './nurse-home.html',
  styleUrl: './nurse-home.css',
})
export class NurseHome implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private nurseActiveFacility = inject(NurseActiveFacility);
  private destroy$ = new Subject<void>();

  isLoading = true;
  professionalId!: string;
  appointment: any;
  invitations: any[] = [];
  moment = moment;

  confirmModal = false;
  selectedInvite: any = null;

  rejectModal = false;
  rejecting = false;
  rejectTargetInvite: any = null;
  reasonControl = new FormControl('');

  constructor() {
    addIcons({
      'chevron-forward-outline': chevronForwardOutline,
      'close-outline': closeOutline,
      'time-outline': timeOutline,
      'alert-circle-outline': alertCircleOutline,
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.professionalId = params.professionalId;
      this.loadDashboard(params.professionalId);
    });

    this.nurseActiveFacility.activeFacilityTypeId$
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.getAppointment();
      });
  }

  loadDashboard(professionalId: string) {
    this.isLoading = true;
    const facilityTypeId = this.nurseActiveFacility.getActiveFacilityTypeId();
    const appointments$ = facilityTypeId
      ? this.api.getMedicalAppointments({ facilityTypeId })
      : of(null);

    forkJoin({
      invitations: this.api.getAllConnectionRequest({
        referencedDocumentId: professionalId,
      }),
      appointments: appointments$,
    }).subscribe({
      next: ({ invitations, appointments }: any) => {
        this.invitations = (invitations ?? []).filter(
          (inv: any) => inv.status === 'Pending'
        );
        this.appointment = appointments
          ? appointments?.data?.find((x: any) => x.status === 'Confirmed')
          : null;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ionViewWillEnter() {
    if (this.professionalId) {
      this.getAppointment();
      this.getInvitations();
    }
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

  statusLabel(inv: any) {
    return inv?.status === 'Approved' ? 'Accepted' : inv?.status;
  }

  isPending(inv: any) {
    return inv?.status === 'Pending';
  }

  isRejected(inv: any) {
    return inv?.status === 'Rejected';
  }

  relativeTime(date?: string) {
    if (!date) {
      return '';
    }

    return moment.utc(date).local().fromNow();
  }

  absoluteTime(date?: string) {
    if (!date) {
      return '';
    }

    return moment.utc(date).local().format('MMM D, YYYY • h:mm A');
  }

  confirmInvitation(inv: any) {
    this.selectedInvite = inv;
    this.confirmModal = true;
  }

  confirmAccept() {
    this.confirmModal = false;
    if (!this.selectedInvite) {
      return;
    }
    this.acceptInvite(this.selectedInvite);
  }

  cancelAccept() {
    this.confirmModal = false;
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
            this.toast.show('Invitation accepted', 'success');
            this.getInvitations();
            this.setActiveFacilityOnFirstAccept(inv);
          });
      });
  }

  private setActiveFacilityOnFirstAccept(inv: any) {
    if (this.nurseActiveFacility.getActiveFacilityTypeId()) {
      return;
    }
    this.nurseActiveFacility.setActiveFacilityTypeId(inv.facilityTypeId);
    this.api
      .getMedicalProfessional({
        professionalId: this.professionalId,
        professionalType: ProfessionalType.Nurse,
      })
      .subscribe((professional: any) => {
        if (professional?.facilityId) {
          this.nurseActiveFacility.setActiveFacilityId(professional.facilityId);
        }
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

  viewAllInvitations() {
    this.router.navigate([
      '/nurse-dashboard',
      this.professionalId,
      'nurse-available-invitations',
    ]);
  }

  getAppointment() {
    const facilityTypeId = this.nurseActiveFacility.getActiveFacilityTypeId();
    if (!facilityTypeId) {
      this.appointment = null;
      return;
    }
    this.api
      .getMedicalAppointments({ facilityTypeId })
      .subscribe((res: any) => {
        this.appointment = res?.data?.find((x: any) => x.status === 'Confirmed');
      });
  }

  viewAllAppointments() {
    this.router.navigate(['/nurse-dashboard', this.professionalId, 'nurse-appointments'], {
      queryParams: { tab: 'All' },
    });
  }

  viewAppointment(a: any) {
    this.router.navigate([
      '/nurse-dashboard',
      this.professionalId,
      'view-appointment',
      a.appointmentId,
      a.memberId,
    ]);
  }

  viewProfile() {
    this.router.navigate(['/nurse-dashboard', this.professionalId, 'nurse-profile']);
  }
}
