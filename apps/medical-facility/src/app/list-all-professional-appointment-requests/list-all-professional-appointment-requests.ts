import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { DocumentStatus } from '@care-way/shared';
import { ConfirmationModal } from '@care-way/ui';
import {
  InfiniteScrollCustomEvent,
  IonButton,
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'medical-facility-list-all-professional-appointment-requests',
  imports: [
    CommonModule,
    IonSkeletonText,
    ConfirmationModal,
    IonContent,
    IonIcon,
    IonSearchbar,
    IonButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  templateUrl: './list-all-professional-appointment-requests.html',
  styleUrl: './list-all-professional-appointment-requests.css',
})
export class ListAllProfessionalAppointmentRequests
  implements OnInit, OnDestroy
{
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  isLoading: boolean;
  confirmModal: boolean;
  loading: boolean;
  activeTab: InviteTab = 'Pending';
  searchTerm = '';
  professionalId: string;
  appointmentRequests$: Observable<any>;
  totalRecords: number;
  appointmentId: string;
  moment = moment;
  statusClick: string;
  skip = 0;
  limit = 20;
  hasMore = true;
  allAppointments: any;
  private destroy$ = new Subject<void>();

  constructor() {
    addIcons({ chevronBackOutline });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.professionalId = params.professionalId;
      this.getAppointmentRequests();
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAppointmentRequests(infiniteEvent?: InfiniteScrollCustomEvent) {
    this.appointmentRequests$ = this.api
      .getMedicalAppointmentRequests({
        skip: this.skip,
        limit: this.limit,
        professionalId: this.professionalId,
        status: this.activeTab === 'All' ? null : (this.activeTab as any),
      })
      .pipe(
        tap((response: any) => {
          this.totalRecords = response.totalRecords;
          this.isLoading = false;
        }),
        map((response: any) => response.data)
      );
    this.appointmentRequests$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.allAppointments =
          this.skip === 0 ? data : [...this.allAppointments, ...data];
        this.hasMore = this.allAppointments.length < this.totalRecords;
        infiniteEvent?.target.complete();
      });
  }

  loadMore(event?: InfiniteScrollCustomEvent) {
    this.skip += this.limit;
    this.getAppointmentRequests(event);
  }

  setTab(tab: InviteTab) {
    this.activeTab = tab;
    this.skip = 0;
    this.allAppointments = [];
    this.getAppointmentRequests();
  }

  onSearch(ev: any) {
    this.searchTerm = (ev?.detail?.value ?? '').toString();
  }

  filteredAppointments() {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) {
      return this.allAppointments;
    }

    return this.allAppointments.filter((a: any) => {
      const haystack = [
        a?.memberName,
        a?.appointment?.appointmentType,
        a?.appointment?.notes,
        a?.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }

  accept(inv: any) {
    this.confirmModal = true;
    this.statusClick = 'Accept';
  }

  reject(inv: any) {
    inv.status = 'Declined';
    if (this.activeTab === 'Pending') this.activeTab = 'Declined';
    this.statusClick = 'Reject';
  }

  viewInvite(inv: any) {
    //
  }

  goBack() {
    history.back();
  }

  confirmAccept() {
    this.api
      .updateProfessionalAppointmentRequest({
        appointmentId: this.appointmentId,
        body: {
          professionalId: this.professionalId,
          status: DocumentStatus.Declined,
        },
      })
      .subscribe((res: any) => {
        this.confirmModal = false;
        this.getAppointmentRequests();
      });
    this.confirmModal = false;
  }

  cancelAccept() {
    this.confirmModal = false;
  }

  declineRequest(appointmentId: any) {
    this.confirmModal = true;
    this.appointmentId = appointmentId;
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
type InviteTab = 'All' | 'Pending' | 'Accepted' | 'Declined';
