import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
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
  chevronForwardOutline,
  chevronBackOutline,
  closeOutline,
  timeOutline,
  alertCircleOutline,
  mailOpenOutline,
  businessOutline,
} from 'ionicons/icons';
import moment from 'moment';
type InviteTab = 'All' | 'Pending' | 'Approved' | 'Rejected';
@Component({
  selector: 'medical-facility-doctor-available-invitation',
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
  templateUrl: './doctor-available-invitation.html',
  styleUrl: './doctor-available-invitation.css',
})
export class DoctorAvailableInvitation implements OnInit {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
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
      'business-outline': businessOutline,
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.professionalId = params.professionalId;
      this.isLoading = true;
      this.getAllInvite();
    });
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

  onSearch(ev: any) {
    this.searchTerm = (ev?.detail?.value ?? '').toString();
  }

  filteredInvites() {
    const q = this.searchTerm.trim().toLowerCase();

    return this.invites.filter((i: any) => {
      const status = (i?.status || '').toString();
      const matchesTab = this.activeTab === 'All' || status === this.activeTab;

      const name = (i?.facilityName || '').toLowerCase();
      const location = (i?.location || '').toLowerCase();

      const matchesSearch = !q || name.includes(q) || location.includes(q);

      return matchesTab && matchesSearch;
    });
  }

  statusLabel(inv: any) {
    return inv?.status === 'Approved' ? 'Accepted' : inv?.status || 'Unknown';
  }

  isPending(inv: any) {
    return inv?.status === 'Pending';
  }

  isRejected(inv: any) {
    return inv?.status === 'Rejected';
  }

  initials(value?: string) {
    const parts = (value || '')
      .trim()
      .split(/\s+/)
      .filter((part) => !!part);

    if (!parts.length) {
      return '--';
    }

    return parts
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
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

    this.accept(this.selectedInvite);
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
            this.toast.show('Invitation approved', 'success');
            this.getAllInvite();
          });
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
    this.router.navigateByUrl(
      `doctor-dashboard/${this.professionalId}/view-invite`,
      {
        state: { invite: inv },
      }
    );
  }

  goBack() {
    this.router.navigate(['/doctor-dashboard', this.professionalId]);
  }

  cancelAccept() {
    this.confirmModal = false;
    this.selectedInvite = null;
  }
}
