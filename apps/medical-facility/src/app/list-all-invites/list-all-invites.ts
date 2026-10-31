import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, ProfessionalType } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import { ConfirmationModal, ToastService } from '@care-way/ui';
import {
  IonContent,
  IonIcon,
  IonSkeletonText,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  chevronBackOutline,
  mailOpenOutline,
  refreshOutline,
} from 'ionicons/icons';
import { FeeFormModal } from '../fee-form-modal/fee-form-modal';
import { switchMap } from 'rxjs';

type InviteFilter = 'All' | 'Pending' | 'Accepted' | 'Rejected';

@Component({
  selector: 'medical-facility-list-all-invites',
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonText,
    IonSkeletonText,
    FeeFormModal,
    ConfirmationModal,
  ],
  templateUrl: './list-all-invites.html',
  styleUrl: './list-all-invites.css',
})
export class ListAllInvites implements OnInit {
  public api = inject(ApiService);
  public route = inject(ActivatedRoute);
  public router = inject(Router);
  public auth = inject(AuthService);
  private toast = inject(ToastService);

  facilityTypeId: string;
  facilityId: string;
  facilityType: string;

  filters: InviteFilter[] = ['All', 'Pending', 'Accepted', 'Rejected'];
  activeFilter: InviteFilter = 'All';

  skeletons = [0, 1, 2];

  private readonly statusMap: Record<Exclude<InviteFilter, 'All'>, string> = {
    Pending: 'Pending',
    Accepted: 'Approved',
    Rejected: 'Rejected',
  };

  loading = false;
  requests: any[] = [];

  isModalOpen = false;
  saving = false;
  selectedRequest: any = null;
  selectedFee: any = null;

  resendConfirmOpen = false;

  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'mail-open-outline': mailOpenOutline,
      'alert-circle-outline': alertCircleOutline,
      'refresh-outline': refreshOutline,
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((param: Params) => {
      this.facilityTypeId = param['categoryId'];
      this.facilityId = param['facilityId'];
      this.facilityType = param['facilityType'];
    });
  }

  ionViewWillEnter() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.api
      .getAllFacilityConnectionRequest({ facilityTypeId: this.facilityTypeId })
      .subscribe({
        next: (res) => {
          this.requests = res.data ?? [];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  setFilter(filter: InviteFilter) {
    this.activeFilter = filter;
  }

  get filteredRequests(): any[] {
    return this.requestsFor(this.activeFilter);
  }

  countFor(filter: InviteFilter): number {
    return this.requestsFor(filter).length;
  }

  initials(name?: string): string {
    return (name ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  private requestsFor(filter: InviteFilter): any[] {
    if (filter === 'All') {
      return this.requests;
    }
    const target = this.statusMap[filter];
    return this.requests.filter((r) => r.status === target);
  }

  isRejected(request: any): boolean {
    return request?.status === 'Rejected';
  }

  resendInvite(request: any) {
    this.selectedRequest = request;

    if (!this.isDoctorRequest(request)) {
      this.resendConfirmOpen = true;
      return;
    }

    this.selectedFee = null;

    this.api
      .getMedicalProfessionalFee({
        professionalId: request.referencedDocumentId,
        facilityTypeId: this.facilityTypeId,
      })
      .subscribe({
        next: (res: any) => {
          this.selectedFee = res?.data?.[0] ?? res ?? null;
        },
      });

    this.isModalOpen = true;
  }

  private isDoctorRequest(request: any): boolean {
    if (request.connectionType !== 'Professional') {
      return false;
    }
    return (
      (request.professionalType ?? ProfessionalType.Doctor) ===
      ProfessionalType.Doctor
    );
  }

  confirmResend() {
    if (!this.selectedRequest) {
      return;
    }
    this.resendDirectly(this.selectedRequest);
  }

  closeResendConfirm() {
    this.resendConfirmOpen = false;
    this.selectedRequest = null;
  }

  private resendDirectly(request: any) {
    this.api
      .facilityConnectionRequest({
        referencedDocumentId: request.referencedDocumentId,
        body: {
          connectionId: request.connectionId,
          facilityTypeId: this.facilityTypeId,
          connectionType: request.connectionType,
          status: 'Pending',
        },
      })
      .subscribe({
        next: () => {
          this.toast.show('Invitation resent successfully', 'success');
          this.closeResendConfirm();
          this.loadRequests();
        },
        error: () => {
          this.toast.show('Unable to resend invitation', 'error');
        },
      });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedRequest = null;
    this.selectedFee = null;
  }

  saveFee(formValue: any) {
    if (!this.selectedRequest) {
      return;
    }

    this.saving = true;

    this.api
      .createMedicalProfessionalFee({
        professionalId: this.selectedRequest.referencedDocumentId,
        facilityTypeId: this.facilityTypeId,
        body: {
          feeId: formValue.feeId,
          facilityTypeId: this.facilityTypeId,
          professionalId: this.selectedRequest.referencedDocumentId,
          virtualConsultation: formValue.virtualConsultation,
          virtualConsultationFee: Number(formValue.virtualConsultationFee),
          physicalConsultationFee: Number(formValue.physicalConsultationFee),
          virtualHospitalFee: Number(formValue.virtualHospitalFee),
          physicalHospitalFee: Number(formValue.physicalHospitalFee),
          virtualConsultationSettlement:
            formValue.virtualConsultationSettlement,
          physicalConsultationSettlement:
            formValue.physicalConsultationSettlement,
        } as any,
      })
      .pipe(
        switchMap(() =>
          this.api.facilityConnectionRequest({
            referencedDocumentId: this.selectedRequest.referencedDocumentId,
            body: {
              connectionId: this.selectedRequest.connectionId,
              facilityTypeId: this.facilityTypeId,
              connectionType: 'Professional',
              status: 'Pending',
            },
          })
        )
      )
      .subscribe({
        next: () => {
          this.saving = false;
          this.toast.show('Invitation resent successfully', 'success');
          this.closeModal();
          this.loadRequests();
        },
        error: () => {
          this.saving = false;
          this.toast.show('Unable to resend invitation', 'error');
        },
      });
  }

  goBack() {
    this.router.navigate([
      'dashboard',
      'more',
      this.facilityType,
      this.facilityId,
      this.facilityTypeId,
    ]);
  }
}
