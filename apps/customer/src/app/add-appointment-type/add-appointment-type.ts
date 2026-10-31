import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MoreMenuPage } from '@healbridge/ui';

@Component({
  selector: 'app-add-appointment-type',
  imports: [MoreMenuPage, CommonModule],
  templateUrl: './add-appointment-type.html',
  styleUrl: './add-appointment-type.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddAppointmentType {
  private router = inject(Router);
  back() {
    this.router.navigateByUrl('/dashboard/appointments');
  }
  moreMenu: any = [
    {
      name: 'One-Time Appointment',
      link: '/dashboard/schedule-appointment',
      icon: '/icons/appointment-icon.svg',
    },
    {
      name: 'Recurring Appointment',
      link: '/dashboard/schedule-appointment',
      icon: '/icons/appointment-icon.svg',
    },
  ];
}
