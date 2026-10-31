import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ApiService,
  AppointmentType,
  MedicalAppointmentStatus,
} from '@healbridge/api';
import {
  ConfirmationModal,
  PlusIconComponent,
  AppointmentCardPrimary,
} from '@healbridge/ui';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonSearchbar,
  IonSkeletonText,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from '@ionic/angular/standalone';
import { StorageService } from '@healbridge/ui';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  arrowForwardOutline,
  chevronBackOutline,
} from 'ionicons/icons';
import { forkJoin, map, Observable, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-appointments',
  imports: [
    RouterLink,
    IonContent,
    CommonModule,
    IonIcon,
    IonSkeletonText,
    IonButton,
    IonSearchbar,
    ConfirmationModal,
    PlusIconComponent,
    AppointmentCardPrimary,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments implements OnDestroy {
  private router = inject(Router);
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  activeTab: InviteTab;
  isLoading = true;
  private destroy$ = new Subject<void>();
  private storageService = inject(StorageService);
  status = MedicalAppointmentStatus;
  appointmentCancellationConfirmationModal: boolean;
  memberId: string;
  selectedItem: string;
  appointmentType = AppointmentType;
  skip = 0;
  limit = 20;
  appointments$!: Observable<any[]>;
  allAppointments: any[] = [];
  currentStatus = '';
  totalRecords = 0;
  hasMore = true;
  statusMap: Record<string, string[]> = {
    Pending: [
      MedicalAppointmentStatus.Pending,
      MedicalAppointmentStatus.AwaitingHospitalConfirmation,
      MedicalAppointmentStatus.AwaitingDoctorAvailability,
    ],
    Confirmed: [
      MedicalAppointmentStatus.AwaitingCustomerPayment,
      MedicalAppointmentStatus.DoctorAvailable,
    ],
    Ready: [MedicalAppointmentStatus.Ready],
    Ongoing: [MedicalAppointmentStatus.Ongoing],
    Completed: [
      MedicalAppointmentStatus.Completed,
      MedicalAppointmentStatus.Settled,
    ],
    Paid: [MedicalAppointmentStatus.Confirmed],
    Cancelled: [
      MedicalAppointmentStatus.CustomerCancelled,
      MedicalAppointmentStatus.HospitalCancelled,
    ],
  };

  constructor() {
    addIcons({ chevronBackOutline, addCircleOutline, arrowForwardOutline });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ionViewWillEnter() {
    this.storageService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((type: any) => {
        this.memberId = type;
        this.activatedRoute.params.subscribe((params: any) => {
          if (params.appointmentStatus === MedicalAppointmentStatus.Pending) {
            this.selectedItem = MedicalAppointmentStatus.Pending;
            this.getMedicalAppointments(MedicalAppointmentStatus.Pending);
            this.activeTab = MedicalAppointmentStatus.Pending;
          } else {
            this.getMedicalAppointments(this.activeTab);
            this.selectedItem = 'All';
            this.activeTab = 'All';
          }
        });
      });
  }

  setTab(tab: InviteTab) {
    this.activeTab = tab;
    this.getMedicalAppointments(tab);
  }

  getMedicalAppointments(status: string) {
    this.currentStatus = status;
    this.skip = 0;
    this.allAppointments = [];
    this.totalRecords = 0;
    this.hasMore = false;
    this.isLoading = true;
    this.fetchAppointments();
  }

  loadMore(event?: InfiniteScrollCustomEvent) {
    this.skip += this.limit;
    this.fetchAppointments(event);
  }

  fetchAppointments(infiniteEvent?: InfiniteScrollCustomEvent) {
    const status = this.currentStatus;
    let appointments$: Observable<any[]>;

    if (!status || status === 'All') {
      appointments$ = this.api
        .getMedicalAppointments({
          memberId: this.memberId,
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
            memberId: this.memberId,
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
      this.isLoading = false;
      infiniteEvent?.target.complete();
    });
  }

  selectStatus(status: string) {
    this.getMedicalAppointments(status);
  }

  pay(appointmentId: string) {
    this.router.navigate(['/dashboard/payment-summary', appointmentId]);
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

  cancelMedicalAppointment() {
    //
  }

  closeConfirmationModal() {
    //
  }

  getStatus(status: any): string {
    for (const [label, statuses] of Object.entries(this.statusMap)) {
      if (statuses.includes(status)) {
        return label;
      }
    }
    return 'Pending';
  }

  joinCall(appointment: any) {
    this.router.navigate([
      'dashboard/appointment-video-call',
      appointment.appointmentId,
    ]);
  }

  viewAppointment(appointment: any) {
    this.router.navigate(
      ['dashboard/view-appointment', appointment.appointmentId],
      {
        queryParams: {
          module: 'Customer',
        },
      }
    );
  }
}
type InviteTab =
  | 'All'
  | 'Pending'
  | 'Confirmed'
  | 'Paid'
  | 'Cancelled'
  | 'Ready'
  | 'Ongoing'
  | 'Completed';
