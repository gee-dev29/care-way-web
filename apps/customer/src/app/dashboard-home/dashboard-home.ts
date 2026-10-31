import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ApiService,
  FacilityType,
  MedicalAppointmentStatus,
} from '@healbridge/api';
import { AuthService, DocumentStatus } from '@healbridge/shared';
import {
  StorageService,
  AddNewEntryCard,
  MedicalRequestCard,
  OrderCard,
  DashboardIdentitiesListCard,
  CardIdentityType,
  AppointmentCardPrimary,
  ToastService,
} from '@healbridge/ui';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonImg,
  Gesture,
  GestureController,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import moment from 'moment';
import {
  catchError,
  filter,
  forkJoin,
  map,
  Observable,
  of,
  shareReplay,
  skip,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  imports: [
    IonContent,
    IonImg,
    IonCard,
    IonCardContent,
    IonSkeletonText,
    CommonModule,
    AddNewEntryCard,
    MedicalRequestCard,
    OrderCard,
    DashboardIdentitiesListCard,
    AppointmentCardPrimary,
    RouterLink,
  ],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
})
export class DashboardHome implements AfterViewInit {
  private gestureCtrl = inject(GestureController);
  private api = inject(ApiService);
  public auth = inject(AuthService);
  private gesture?: Gesture;
  private router = inject(Router);
  private el: ElementRef;
  loaded = false;
  private membersReady = false;
  private mainDataReady = false;
  private toastr = inject(ToastService);
  allData: any = [];
  routeLink: any;
  private storageService = inject(StorageService);
  private destroy$ = new Subject<void>();
  memberId: any;
  requests: any;
  appointment: any = null;
  statusImages: any = {
    Pending: 'logo/pending-icon.svg',
    Paid: '/icons/paid-icon-black.svg',
    Delivered: '/icons/delivered-icon-black.svg',
    Cancelled: '/icons/cancel-icon-black.svg',
  };

  statusColors: { [key: string]: string } = {
    Pending: '#F4C430',
    Paid: '#007BFF',
    Delivered: '#28A745',
    Cancelled: '#DC3545',
  };
  index = 0;
  members$: Observable<any>;
  public referencedDocumentId: any;
  @ViewChild('tabs', { static: false }) tabs?: ElementRef<HTMLElement>;
  membersTotalRecords: any;
  type = CardIdentityType;
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
    Paid: [MedicalAppointmentStatus.Confirmed],
    Cancelled: [
      MedicalAppointmentStatus.CustomerCancelled,
      MedicalAppointmentStatus.HospitalCancelled,
    ],
  };
  status = MedicalAppointmentStatus;

  ionViewWillEnter() {
    const el = this.tabs?.nativeElement;
    if (el) el.style.transform = 'translateX(0)';

    this.membersReady = false;
    this.mainDataReady = false;

    this.auth.userDetail(this.api, (auth) => {
      if (auth?.userType !== 'Default') {
        this.toastr.show("You can't use this credential on this app", 'error');
        this.membersReady = true;
        this.checkLoaded();
        return;
      }

      this.referencedDocumentId = auth?.jti;

      this.members$ = this.api
        .getMembers({
          referencedDocumentId: this.referencedDocumentId,
          skip: 0,
          limit: 3,
        })
        .pipe(
          tap((res) => (this.membersTotalRecords = res.totalRecords)),
          map((res) => res.data),
          shareReplay(1)
        );

      this.members$.subscribe({
        next: () => {
          this.membersReady = true;
          this.checkLoaded();
        },
        error: () => {
          this.membersReady = true;
          this.checkLoaded();
        },
      });
    });

    this.storageService.user$
      .pipe(
        takeUntil(this.destroy$),
        filter((user) => !!user),
        switchMap((user) => {
          this.memberId = user;
          return forkJoin({
            load: this.load(user),
            appointment: this.getAppointment(user),
          }).pipe(map(() => user));
        }),
        switchMap((user) =>
          this.api.getServiceRequests({
            memberId: user,
            referralType: 'Pharmacy' as any,
          })
        ),
        switchMap((response: any) => {
          const requests = response.data || [];
          if (requests.length === 0) return of([]);
          return forkJoin(
            requests.map((req: any) =>
              forkJoin({
                member: this.api.getMember({ memberId: req.memberId }),
                uploads: this.api.getUploads({
                  referencedDocumentId: req.serviceRequestId,
                }),
              }).pipe(
                map(({ member, uploads }) => ({
                  ...req,
                  member: {
                    ...member,
                    age: moment().diff(moment(member.dob), 'years'),
                  },
                  uploads,
                }))
              )
            )
          );
        }),
        tap((details: any) => {
          this.requests = details[0];
          this.mainDataReady = true;
          this.checkLoaded();
        }),
        catchError(() => {
          this.mainDataReady = true;
          this.checkLoaded();
          return of(null);
        })
      )
      .subscribe();
  }

  private checkLoaded() {
    if (this.membersReady && this.mainDataReady) {
      this.loaded = true;
    }
  }

  load(userId: any): Observable<any> {
    return this.api
      .getServiceRequestOrders({
        memberId: userId,
        skip: 0,
        LimitSize: 1,
      } as any)
      .pipe(
        map((response) => {
          this.allData = response.data;
        })
      );
  }
  ngAfterViewInit() {
    setTimeout(() => {
      const el = this.tabs?.nativeElement;
      if (!el) {
        return;
      }
      const gesture: Gesture = this.gestureCtrl.create({
        el,
        gestureName: 'fast-swipe',
        direction: 'x',
        threshold: 0,
        gesturePriority: 100,
        maxAngle: 45,
        onStart: () => {
          el.style.transition = 'none';
        },
        onMove: (ev) => {
          el.style.transform = `translateX(${ev.deltaX}px)`;
        },
        onEnd: (ev) => {
          const threshold = 80;
          const { deltaX } = ev;
          el.style.transition = 'transform 150ms ease-out';
          if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
              //
            } else if (ev.deltaX < 0) {
              this.router.navigateByUrl('dashboard/appointments');
            }
          }
          el.style.transform = 'translateX(0)';
        },
      });

      gesture.enable(true);
    }, 300);
    setTimeout(() => {
      this.loaded = true;
    }, 8000);
  }
  route(orderId: any) {
    this.router.navigate(['/dashboard/order-details', orderId]);
  }

  toVitals() {
    this.router.navigate(['/dashboard/vitals']);
  }
  memberProfile(memberId: string) {
    this.router.navigate(['/dashboard/member-details', memberId]);
  }

  viewAll(url: string) {
    this.router.navigate([url]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  viewIt(item: any) {
    switch (item.status) {
      case DocumentStatus.Draft:
      case DocumentStatus.Pending:
      case DocumentStatus.Declined:
        this.router.navigateByUrl(
          `/dashboard/uploaded-prescription/${FacilityType.Pharmacy.toLowerCase()}/${
            item.serviceRequestId
          }`
        );
        break;
      case DocumentStatus.Processed:
        this.router.navigateByUrl(
          `/dashboard/${item.serviceRequestId}/${
            FacilityType.Pharmacy
          }/${FacilityType.Pharmacy.toLowerCase()}/${item.memberId}/${
            item.facilityTypeId
          }/pricing`
        );
        break;
      case DocumentStatus.Ordered:
        this.api
          .getServiceRequestOrders({
            serviceRequestId: item.serviceRequestId,
            memberId: this.memberId,
          })
          .subscribe((response: any) => {
            const filter = response.data.find(
              (data: any) => data.serviceRequestCode === item.serviceRequestCode
            );
            this.router.navigate([
              '/dashboard/order-details',
              filter.serviceRequestOrderId,
            ]);
          });

        break;
    }
  }

  viewOrder(item: any) {
    this.router.navigate([
      '/dashboard/order-details',
      item.serviceRequestOrderId,
    ]);
  }

  getMembers() {
    this.members$ = this.api
      .getMembers({
        referencedDocumentId: this.referencedDocumentId,
        skip: 0,
        limit: 3,
      })
      .pipe(
        tap((response: any) => {
          this.membersTotalRecords = response.totalRecords;
        }),
        switchMap((response: any) => {
          const members = response.data || [];

          return forkJoin(
            members.map((member: any) =>
              this.api
                .getUploads({
                  referencedDocumentId: member.memberId,
                })
                .pipe(
                  map((uploads: any[]) => ({
                    ...member,
                    profilePicture: uploads?.length
                      ? uploads[uploads.length - 1].url
                      : null,
                  }))
                )
            )
          );
        })
      );
  }

  addNew(url: string) {
    this.router.navigateByUrl(url);
  }

  addIdentity() {
    this.router.navigateByUrl('dashboard/add-member');
  }

  viewAllMembers() {
    this.router.navigateByUrl('dashboard/all-members');
  }

  getAppointment(memberId: string): Observable<any> {
    return this.api.getMedicalAppointments({ memberId }).pipe(
      tap((appointment: any) => {
        if (appointment.data.length) {
          this.appointment = appointment.data[0];
        }
      }),
      catchError(() => of(null))
    );
  }

  viewAllAppointments() {
    this.router.navigateByUrl('/dashboard/appointments');
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

  getStatus(status: any): string {
    for (const [label, statuses] of Object.entries(this.statusMap)) {
      if (statuses.includes(status)) {
        return label;
      }
    }
    return 'Pending';
  }
}
