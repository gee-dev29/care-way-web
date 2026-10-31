import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApiService,
  AppointmentType,
  MedicalAppointmentStatus,
} from '@care-way/api';
import { ConfirmationModal, AppointmentCardPrimary } from '@care-way/ui';
import {
  InfiniteScrollCustomEvent,
  IonButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { forkJoin, map, Observable, of, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-doctor-available-appointments',
  imports: [
    CommonModule,
    IonIcon,
    IonSkeletonText,
    IonButton,
    ConfirmationModal,
    IonSearchbar,
    AppointmentCardPrimary,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  templateUrl: './doctor-available-appointments.html',
  styleUrl: './doctor-available-appointments.css',
})
export class DoctorAvailableAppointments implements OnDestroy {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  MedicalAppointmentStatus = MedicalAppointmentStatus;
  professionalId: string;
  isLoading = false;
  confirmModal = false;
  appointmentType = AppointmentType;
  activeTab: any = 'All';
  searchTerm = '';
  appointments$: Observable<any>;
  allAppointments: any[] = [];
  private destroy$ = new Subject<void>();
  source$: Observable<any[]>;
  currentTab = '';
  totalRecords = 0;
  hasMore = true;
  skip = 0;
  limit = 20;
  statusMap: Record<string, string[]> = {
    Pending: [MedicalAppointmentStatus.AwaitingCustomerPayment],
    Confirmed: [MedicalAppointmentStatus.Confirmed],
    Ready: [MedicalAppointmentStatus.Ready],
    Ongoing: [MedicalAppointmentStatus.Ongoing],
    Completed: [
      MedicalAppointmentStatus.Completed,
      MedicalAppointmentStatus.Settled,
    ],
    Cancelled: [MedicalAppointmentStatus.HospitalCancelled],
    Decline: [MedicalAppointmentStatus.CustomerCancelled],
  };

  constructor() {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      arrowForwardOutline,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ionViewWillEnter() {
    this.load();
  }

  load() {
    this.activatedRoute.params.pipe(take(1)).subscribe((params: any) => {
      this.professionalId = params.professionalId;
      this.activatedRoute.queryParams.pipe(take(1)).subscribe((query: any) => {
        if (query['tab']) {
          this.activeTab = query['tab'];
          this.setTab(query['tab']);
          return;
        }
        this.activeTab = 'All';
        this.getMedicalAppointment(this.activeTab);
      });
    });
  }

  setTab(tab: any) {
    // this.allAppointments = [];
    this.activeTab = tab;
    this.getMedicalAppointment(tab);
  }

  getMedicalAppointment(tab: string) {
    this.currentTab = tab;
    this.skip = 0;
    this.allAppointments = [];
    this.hasMore = true;
    this.fetchAppointments();
  }

  fetchAppointments(infiniteEvent?: InfiniteScrollCustomEvent) {
    let appointments$: Observable<any[]>;
    const tab = this.currentTab;
    if (!tab || tab === 'All') {
      appointments$ = this.api
        .getMedicalAppointments({
          professionalId: this.professionalId,
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
      const statusesToFetch = this.statusMap[tab] ?? [];
      if (!statusesToFetch.length) {
        appointments$ = of([]);
      } else {
        const requests = statusesToFetch.map((singleStatus) =>
          this.api.getMedicalAppointments({
            professionalId: this.professionalId,
            status: singleStatus,
            skip: this.skip,
            limit: this.limit,
          } as any)
        );
        appointments$ = forkJoin(requests).pipe(
          map((responses: any[]) => {
            this.totalRecords = responses.reduce(
              (total, response) => total + (response.totalRecords ?? 0),
              0
            );
            return responses.flatMap((response) => response.data ?? []);
          })
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

  loadMore(event?: InfiniteScrollCustomEvent) {
    this.skip += this.limit;
    this.fetchAppointments(event);
  }

  viewAppointment(a: any) {
    if (a.appointmentType === 'Physical') {
      this.router.navigate([
        '/doctor-dashboard',
        this.professionalId,
        'view-appointment',
        a.appointmentId,
        a.memberId,
      ]);
    } else {
      this.router.navigate([
        '/doctor-dashboard',
        this.professionalId,
        'view-appointment',
        a.appointmentId,
        a.memberId,
      ]);
    }
  }

  onSearch(e: any) {
    this.searchTerm = e?.detail?.value ?? '';
  }

  filteredAppointments() {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) {
      return this.allAppointments;
    }

    return this.allAppointments.filter((a: any) => {
      const haystack = [
        a?.memberName,
        a?.professionalName,
        a?.specialization,
        a?.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }

  confirm(a: any) {
    this.confirmModal = true;
  }

  cancel(a: any) {
    a.status = 'Cancelled';
    this.activeTab = 'Cancelled';
  }

  join(appointment: any) {
    this.router.navigate([
      'doctor-dashboard',
      this.professionalId,
      'appointment-video-call-doctor',
      appointment.appointmentId,
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

  viewRecord(a: any) {
    //
  }

  goBack() {
    this.router.navigate(['/doctor-dashboard', this.professionalId]);
  }

  confirmAccept() {
    this.confirmModal = false;
  }

  cancelAccept() {
    this.confirmModal = false;
  }
}
