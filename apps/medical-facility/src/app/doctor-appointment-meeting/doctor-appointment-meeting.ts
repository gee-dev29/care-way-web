import { Component, inject, OnDestroy } from '@angular/core';
import { ApiService } from '@care-way/api';
import { ViewAppointment } from '../view-appointment/view-appointment';
import { ActivatedRoute } from '@angular/router';
import { VitalsRefresh } from '@care-way/shared';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-doctor-appointment-meeting',
  imports: [ViewAppointment],
  templateUrl: './doctor-appointment-meeting.html',
  styleUrl: './doctor-appointment-meeting.css',
})
export class DoctorAppointmentMeeting implements OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private api = inject(ApiService);
  private vitalsRefresh = inject(VitalsRefresh);
  private destroy$ = new Subject<void>();

  appointmentId: string;
  memberId: string;

  ionViewWillEnter() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.appointmentId = params.appointmentId;
        this.memberId = params.memberId;
      });

    this.vitalsRefresh.vital$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.activatedRoute.params
        .pipe(takeUntil(this.destroy$))
        .subscribe((params: any) => {
          this.appointmentId = params.appointmentId;
          this.memberId = params.memberId;
        });
    });

    if (!this.vitalsRefresh.getVital()) {
      this.activatedRoute.params
        .pipe(takeUntil(this.destroy$))
        .subscribe((params: any) => {
          this.appointmentId = params.appointmentId;
          this.memberId = params.memberId;
        });
    }
    this.vitalsRefresh.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
