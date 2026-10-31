import { Component, inject, OnDestroy } from '@angular/core';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { forkJoin, map, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import {
  IonSearchbar,
  IonContent,
  IonIcon,
  IonSkeletonText,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from '@ionic/angular/standalone';
import { ConfirmationModal, AppointmentCardPrimary } from '@care-way/ui';
import { CommonModule } from '@angular/common';
import {
  ApiService,
  AppointmentType,
  MedicalAppointmentStatus,
} from '@care-way/api';
import { ActivatedRoute, Router } from '@angular/router';
import { LimitSize } from '@care-way/shared';

@Component({
  selector: 'medical-facility-list-all-medical-facility-appointments',
  imports: [
    IonSearchbar,
    IonContent,
    IonIcon,
    IonSkeletonText,
    ConfirmationModal,
    CommonModule,
    AppointmentCardPrimary,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  templateUrl: './list-all-medical-facility-appointments.html',
  styleUrl: './list-all-medical-facility-appointments.css',
})
export class ListAllMedicalFacilityAppointments implements OnDestroy {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  isLoading: boolean;
  confirmModal: boolean;
  loading: boolean;
  activeTab: InviteTab = 'Pending';
  searchTerm = '';
  facilityId: string;
  appointments$: Observable<any>;
  totalRecords: number;
  facilityTypeId: string;
  facilityType: string;
  hasMore = true;
  skip = 0;
  limit = 20;
  allAppointments: any;
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
  status = MedicalAppointmentStatus;
  type = AppointmentType;

  constructor() {
    addIcons({ chevronBackOutline });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ionViewWillEnter() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.facilityTypeId = params.facilityTypeId;
      this.facilityType = params.facilityType;
      if (params.appointmentStatus === 'Assigned') {
        this.activeTab = 'Assigned';
      } else if (params.appointmentStatus === 'Paid') {
        this.activeTab = 'Paid';
      } else if (params.appointmentStatus === 'Pending') {
        this.activeTab = 'Pending';
      } else {
        this.activeTab = 'All';
      }
      this.getAppointments();
    });
  }

  loadMore(event?: InfiniteScrollCustomEvent) {
    this.skip += this.limit;
    this.getAppointments(event);
  }
  getAppointments(infiniteEvent?: InfiniteScrollCustomEvent) {
    const status = this.activeTab;
    let appointments$: Observable<any[]>;

    if (!status || status === 'All') {
      appointments$ = this.api
        .getMedicalAppointments({
          facilityTypeId: this.facilityTypeId,
          skip: this.skip,
          limit: this.limit,
        })
        .pipe(
          map((appointments: any) => {
            this.totalRecords = appointments.totalRecords;
            return appointments.data ?? [];
          })
        );
    } else {
      const statusesToFetch = this.statusMap[status] ?? [];
      if (!statusesToFetch.length) {
        appointments$ = of([]);
      } else {
        const requests = statusesToFetch.map((singleStatus) =>
          this.api.getMedicalAppointments({
            facilityTypeId: this.facilityTypeId,
            status: singleStatus,
            skip: this.skip,
            limit: this.limit,
          } as any)
        );
        appointments$ = forkJoin(requests).pipe(
          map((responses) =>
            responses.flatMap((response: any) => {
              this.totalRecords = response.totalRecords;
              return response.data ?? [];
            })
          )
        );
      }
    }
    appointments$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.allAppointments =
        this.skip === 0 ? data : [...this.allAppointments, ...data];
      this.hasMore = this.allAppointments.length < this.totalRecords;
      infiniteEvent?.target.complete();
    });
  }

  setTab(tab: InviteTab) {
    this.activeTab = tab;
    this.getAppointments();
  }

  onSearch(ev: any) {
    this.searchTerm = (ev?.detail?.value ?? '').toString();
  }

  accept(inv: any) {
    this.confirmModal = true;
  }

  reject(inv: any) {
    inv.status = 'Declined';
    if (this.activeTab === 'Pending') this.activeTab = 'Declined';
  }

  viewInvite(inv: any) {
    //
  }

  goBack() {
    history.back();
  }

  confirmAccept() {
    this.confirmModal = false;
  }

  cancelAccept() {
    this.confirmModal = false;
  }

  declineRequest(appointmentRequest: any) {
    this.confirmModal = true;
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

  getStatus(status: any): string {
    for (const [label, statuses] of Object.entries(this.statusMap)) {
      if (statuses.includes(status)) {
        return label;
      }
    }
    return 'Pending';
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
          this.facilityType,
          this.facilityId,
          this.facilityTypeId,
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
}
type InviteTab = 'All' | 'Pending' | 'Assigned' | 'Paid' | 'Declined';
