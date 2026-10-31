import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'ui-appointment-request-table',
  imports: [CommonModule, TableModule],
  templateUrl: './appointment-request-table.html',
  styleUrl: './appointment-request-table.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppointmentRequestTable {
  @Input() totalRecords = 0;
  @Input() appointmentRequests$: Observable<any>;
  @Input() professionalId: string;
  @Input() showDoctor: boolean;
  moment = moment;
}
