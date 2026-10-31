import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, AppointmentType } from '@care-way/api';
import { ConversionService, LimitSize } from '@care-way/shared';
import { ScheduleAppointment } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-schedule-appointment',
  imports: [ScheduleAppointment, IonContent],
  templateUrl: './schedule-appointment.html',
  styleUrl: './schedule-appointment.css',
})
export class ScheduleAppointmentComponent {
  public api = inject(ApiService);
  public activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  public conversion = inject(ConversionService);
  public appointmentType = AppointmentType;
  public limitSize = LimitSize;
  route: any;

  constructor() {
    const isNurse = this.router.url.includes('nurse-dashboard');

    this.activatedRoute.params.subscribe((params: any) => {
      this.route = isNurse
        ? `/nurse-dashboard/${params.professionalId}/patient-profile/${params.facilityId}/${params.facilityTypeId}/${params.memberId}`
        : `dashboard/patient-profile/${params.facilityType}/${params.facilityId}/${params.facilityTypeId}/${params.memberId}`;
    });
  }
}
