import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, ProfessionalType } from '@care-way/api';
import { NurseActiveFacility } from '@care-way/shared';
import {
  ButtonComponent,
  ConfirmationModal,
  InputTextarea,
  ToastService,
} from '@care-way/ui';
import {
  IonIcon,
  IonModal,
  IonSearchbar,
  IonSkeletonText,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  chevronBackOutline,
  chevronForwardOutline,
  closeOutline,
  mailOpenOutline,
  timeOutline,
} from 'ionicons/icons';
import moment from 'moment';
type InviteTab = 'Pending' | 'Approved' | 'Rejected';
@Component({
  selector: 'medical-facility-nurse-available-invitation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonIcon,
    IonSkeletonText,
    IonSearchbar,
    IonModal,
    IonText,
    ConfirmationModal,
    ButtonComponent,
    InputTextarea,
  ],
  templateUrl: './nurse-available-invitation.html',
  styleUrl: './nurse-available-invitation.css',
})
export class NurseAvailableInvitation implements OnInit {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private nurseActiveFacility = inject(NurseActiveFacility);
  isLoading = true;
  confirmModal = false;
  selectedInvite: any = null;

  rejectModal = false;
  rejecting = false;
  rejectInvite: any = null;
  reasonControl = new FormControl('');

  activeTab: InviteTab = 'Pending';
  searchTerm = '';
  professionalId: string;

  invites: any[] = [];

  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'close-outline': closeOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'time-outline': timeOutline,
      'alert-circle-outline': alertCircleOutline,
      'mail-open-outline': mailOpenOutline,
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.professionalId = params.professionalId;
      this.isLoading = true;
      this.getAllInvite();
    });
  }

  ionViewWillEnter() {
    if (this.professionalId) {
      this.getAllInvite();
    }
  }

  getAllInvite() {
    this.api
      .getAllConnectionRequest({ referencedDocumentId: this.professionalId })
      .subscribe((res: any) => {
        this.invites = res ?? [];
        this.isLoading = false;
      });
  }

  setTab(tab: InviteTab) {
    this.activeTab = tab;
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

  onSearch(ev: any) {
    this.searchTerm = (ev?.detail?.value ?? '').toString();
  }

  filteredInvites() {
    const q = this.searchTerm.trim().toLowerCase();

    return this.invites.filter((i: any) => {
      const status = (i?.status || '').toString();
      const matchesTab = status === this.activeTab;

      const name = (i?.facilityTypeName || '').toLowerCase();
      const location = (i?.location || '').toLowerCase();

      const matchesSearch = !q || name.includes(q) || location.includes(q);

      return matchesTab && matchesSearch;
    });
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
    this.accept(this.selectedInvite);
  }

  cancelAccept() {
    this.confirmModal = false;
    this.selectedInvite = null;
  }

  accept(inv: any) {
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
            this.getAllInvite();
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

  reject(inv: any) {
    this.rejectInvite = inv;
    this.reasonControl.reset('');
    this.rejectModal = true;
  }

  closeReject() {
    this.rejectModal = false;
    this.rejectInvite = null;
    this.reasonControl.reset('');
  }

  submitReject() {
    const reason = (this.reasonControl.value ?? '').trim();
    if (!reason || !this.rejectInvite) {
      return;
    }

    this.rejecting = true;
    this.api
      .updateFacilityConnectionRequest({
        referencedDocumentId: this.professionalId,
        body: {
          connectionId: this.rejectInvite.connectionId,
          status: 'Rejected',
          reason: reason,
        } as any,
      })
      .subscribe({
        next: () => {
          this.rejecting = false;
          this.toast.show('Invitation Rejected', 'success');
          this.closeReject();
          this.getAllInvite();
        },
        error: () => {
          this.rejecting = false;
          this.toast.show('Unable to reject invitation', 'error');
        },
      });
  }

  viewInvite(inv: any) {
    //
  }

  goBack() {
    this.router.navigate(['/nurse-dashboard', this.professionalId]);
  }
}
