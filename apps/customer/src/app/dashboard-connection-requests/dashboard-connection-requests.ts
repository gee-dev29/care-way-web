import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { Status } from '@care-way/shared';
import { ConfirmationModal, StorageService } from '@care-way/ui';
import {
  IonIcon,
  IonSkeletonText,
  IonButton,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { switchMap } from 'rxjs';
type InviteTab = 'Pending' | 'Approved' | 'Rejected';

@Component({
  selector: 'app-dashboard-connection-requests',
  imports: [
    CommonModule,
    IonIcon,
    IonSkeletonText,
    IonButton,
    IonSearchbar,
    ConfirmationModal,
  ],
  templateUrl: './dashboard-connection-requests.html',
  styleUrl: './dashboard-connection-requests.css',
})
export class DashboardConnectionRequests implements OnInit {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private storageService = inject(StorageService);
  private route = inject(Router);

  isLoading = false;
  confirmModal = false;

  activeTab: InviteTab = 'Pending';
  searchTerm = '';
  professionalId: string;
  memberId: string;

  invites: any = [];

  constructor() {
    addIcons({ chevronBackOutline });
  }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.storageService.user$.subscribe((memberId: any) => {
      this.memberId = memberId;
      this.api
        .getAllConnectionRequest({ referencedDocumentId: this.memberId })
        .subscribe((res: any) => {
          this.invites = res ?? [];
          this.isLoading = false;
        });
    });
  }

  setTab(tab: InviteTab) {
    this.activeTab = tab;
    this.reload();
  }

  onSearch(ev: any) {
    this.searchTerm = (ev?.detail?.value ?? '').toString();
  }

  getDate(date: string) {
    return date?.split(' ')[0];
  }
  getTime(date: string) {
    const time = date?.split(' ')[1];
    if (!time) return '';

    const [hourStr, minute, second] = time.split(':');
    let hour = parseInt(hourStr, 10);

    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${hour}:${minute}:${second} ${ampm}`;
  }

  filteredInvites() {
    const search = this.searchTerm.trim().toLowerCase();

    return this.invites.filter((i: any) => {
      const status = (i?.status || '').toString();
      const matchesTab = status === this.activeTab;

      const name = (i?.facilityName || '').toLowerCase();

      const matchesSearch = !search || name.includes(search);

      return matchesTab && matchesSearch;
    });
  }

  updateFacilityConRequest(data: any, status: any) {
    return this.api
      .updateFacilityConnectionRequest({
        referencedDocumentId: this.memberId,
        body: {
          connectionId: data.connectionId,
          status: status,
        },
      })
      .pipe(
        switchMap(() =>
          this.api.connectMemberToFacilityType({
            facilityTypeId: data.facilityTypeId,
            memberId: this.memberId,
            body: {
              connectionId: data.connectionId,
            },
          })
        )
      );
  }

  accept(invite: any) {
    this.updateFacilityConRequest(invite, Status.Approved).subscribe({
      next: () => {
        this.confirmModal = true;
      },
    });
  }

  reject(invite: any) {
    this.updateFacilityConRequest(invite, Status.Rejected).subscribe({
      next: () => {
        if (this.activeTab === 'Pending') {
          this.activeTab = 'Rejected';
        }
      },
    });
  }

  viewInvite(inv: any) {
    //
  }

  goBack() {
    this.route.navigateByUrl('dashboard/home');
  }
  confirmAccept() {
    this.confirmModal = false;
    this.reload();
  }
  cancelAccept() {
    this.confirmModal = false;
    this.reload();
  }
}
