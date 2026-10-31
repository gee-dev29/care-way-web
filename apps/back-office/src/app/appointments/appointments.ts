import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { Export } from '@care-way/shared';
import { PageBody, DesktopButton } from '@care-way/ui';
import { AppointmentTable } from '../appointment-table/appointment-table';

@Component({
  selector: 'back-office-appointments',
  imports: [PageBody, DesktopButton, AppointmentTable],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Appointments {
  private api = inject(ApiService);
  exportService = inject(Export);
  totalRecords = 0;
  private router = inject(Router);
  filters: object;

  view(appointmentId: any) {
    this.router.navigate(['appointment-details', appointmentId]);
  }

  export() {
    this.api
      .getMedicalAppointments({
        ...this.filters,
        limit: this.totalRecords,
      })
      .subscribe((appointments: any) => {
        this.exportService.exportExcel(appointments.data, 'Appointments');
      });
  }
}
