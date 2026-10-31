import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConversionService, Specialization } from '@care-way/shared';
import { Item, AppointmentForm } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-pharmacist-follow-up',
  imports: [IonContent, AppointmentForm],
  templateUrl: './pharmacist-follow-up.html',
  styleUrl: './pharmacist-follow-up.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PharmacistFollowUp {
  private router = inject(Router);
  private conversion = inject(ConversionService);
  selectedTime: any;
  date: any;
  time: any;
  notes: any;
  today: string;
  tenYearsAhead: string;
  doctors: Item[] = [];
  timeSlots: string[] = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

  constructor() {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    const future = new Date();
    future.setFullYear(future.getFullYear() + 10);
    this.tenYearsAhead = future.toISOString().split('T')[0];
  }
  ngOnInit(): void {
    this.conversion.convert(Specialization, this.doctors);
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }
  goBack() {
    this.router.navigateByUrl('/patient-profile');
  }
  proceed() {
    //
  }
}
