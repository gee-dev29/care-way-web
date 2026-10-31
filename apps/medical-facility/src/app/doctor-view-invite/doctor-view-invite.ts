import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import {
  ButtonComponent,
  ConfirmationModal,
  InputTextarea,
  ToastService,
} from '@healbridge/ui';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonModal,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'medical-facility-doctor-view-invite',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonText,
    IonIcon,
    IonCard,
    IonCardContent,
    IonModal,
    ConfirmationModal,
    ButtonComponent,
    InputTextarea,
  ],
  templateUrl: './doctor-view-invite.html',
  styleUrl: './doctor-view-invite.css',
})
export class DoctorViewInvite {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  professionalId = '';
  invite: any = null;
  selectedInvite: any = null;
  confirmModal = false;
  rejectModal = false;
  rejecting = false;
  reasonControl = new FormControl('');

  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'close-outline': closeOutline,
    });
  }

  ionViewWillEnter() {
    this.route.params.subscribe((param: Params) => {
      this.professionalId = param['professionalId'] as string;
    });

    const navigationState = history.state;
    this.selectedInvite = navigationState?.invite ?? null;

    this.api
      .getMedicalProfessionalFee({
        professionalId: this.professionalId,
        facilityTypeId: this.selectedInvite?.facilityTypeId,
      })
      .subscribe((res: any) => {
        this.invite = res?.data?.length ? res.data[0] : null;
      });
  }

  confirmInvitation() {
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
      .subscribe(() => {
        this.api
          .connectProfessionalToFacilityType({
            facilityTypeId: inv.facilityTypeId,
            professionalId: this.professionalId,
            body: {
              connectionId: inv.connectionId,
            },
          })
          .subscribe(() => {
            this.toast.show('Invitation Accepted', 'success');
            this.routeTo();
          });
      });
  }

  reject() {
    this.reasonControl.reset('');
    this.rejectModal = true;
  }

  closeReject() {
    this.rejectModal = false;
    this.reasonControl.reset('');
  }

  submitReject() {
    const reason = (this.reasonControl.value ?? '').trim();
    if (!reason || !this.selectedInvite) {
      return;
    }

    this.rejecting = true;
    this.api
      .updateFacilityConnectionRequest({
        referencedDocumentId: this.professionalId,
        body: {
          connectionId: this.selectedInvite.connectionId,
          status: 'Rejected',
          reason,
        } as any,
      })
      .subscribe({
        next: () => {
          this.rejecting = false;
          this.toast.show('Invitation Rejected', 'success');
          this.closeReject();
          this.routeTo();
        },
        error: () => {
          this.rejecting = false;
          this.toast.show('Unable to reject invitation', 'error');
        },
      });
  }

  routeTo() {
    this.router.navigateByUrl(
      `doctor-dashboard/${this.professionalId}/doctor-available-invitations`
    );
  }

  cancelAccept() {
    this.confirmModal = false;
    // this.selectedInvite = null;
  }
}
