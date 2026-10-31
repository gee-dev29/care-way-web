import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, AppointmentType, VitalSignType } from '@care-way/api';
import { LimitSize } from '@care-way/shared';
import { ScheduleAppointment } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-schedule-appointment',
  imports: [ScheduleAppointment, IonContent],
  templateUrl: './schedule-appointment.html',
  styleUrl: './schedule-appointment.css',
})
export class ScheduleAppointmentComponent implements OnInit {
  public api = inject(ApiService);
  public route = inject(ActivatedRoute);
  public appointmentType = AppointmentType;
  public limitSize = LimitSize;
  symptomId: string | null = null;
  vitalSign: VitalSignType.Symptom = VitalSignType.Symptom;

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.symptomId = params.symptomId;
    });
  }
}
