import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApiService,
  AppointmentType,
  MedicalAppointmentStatus,
} from '@healbridge/api';
import { NurseActiveFacility } from '@healbridge/shared';
import { AppointmentCardPrimary } from '@healbridge/ui';
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
import {
  distinctUntilChanged,
  forkJoin,
  map,
  Observable,
  of,
  skip,
  Subject,
  take,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'medical-facility-nurse-appointments',
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonSkeletonText,
    IonButton,
    IonSearchbar,
    AppointmentCardPrimary,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  templateUrl: './nurse-appointments.html',
  styleUrl: './nurse-appointments.css',
})
export class NurseAppointments implements OnDestroy, OnInit {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private nurseActiveFacility = inject(NurseActiveFacility);

  MedicalAppointmentStatus = MedicalAppointmentStatus;
  professionalId!: string;
  isLoading = false;
  appointmentType = AppointmentType;
  activeTab: any = 'All';
  searchTerm = '';
  appointments$: Observable<any>;
  allAppointments: any[] = [];
  private destroy$ = new Subject<void>();
  currentTab = '';
  totalRecords = 0;
  hasMore = true;
  skip = 0;
  limit = 20;
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
    if (this.professionalId) {
      this.getMedicalAppointment(this.activeTab);
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
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

    this.nurseActiveFacility.activeFacilityTypeId$
      .pipe(distinctUntilChanged(), skip(1), takeUntil(this.destroy$))
      .subscribe(() => {
        this.getMedicalAppointment(this.activeTab);
      });
  }

  setTab(tab: any) {
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
    const tab = this.currentTab;
    const facilityTypeId = this.nurseActiveFacility.getActiveFacilityTypeId();
    if (!facilityTypeId) {
      this.allAppointments = [];
      this.hasMore = false;
      infiniteEvent?.target.complete();
      return;
    }
    let appointments$: Observable<any[]>;
    if (!tab || tab === 'All') {
      appointments$ = this.api
        .getMedicalAppointments({
          facilityTypeId,
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
            facilityTypeId,
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
      this.allAppointments = this.skip === 0 ? data : [...this.allAppointments, ...data];
      this.hasMore = this.allAppointments.length < this.totalRecords;
      infiniteEvent?.target.complete();
    });
  }
  loadMore(event?: InfiniteScrollCustomEvent) {
    this.skip += this.limit;
    this.fetchAppointments(event);
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

  getStatus(status: any): string {
    for (const [label, statuses] of Object.entries(this.statusMap)) {
      if (statuses.includes(status)) {
        return label;
      }
    }
    return 'Pending';
  }

  goBack() {
    this.router.navigate(['/nurse-dashboard', this.professionalId]);
  }
}
