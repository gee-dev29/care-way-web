import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-medical-professional-hospital-table',
  imports: [CommonModule, TableModule],
  templateUrl: './medical-professional-hospital-table.html',
  styleUrl: './medical-professional-hospital-table.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MedicalProfessionalHospitalTable {
  @Input() totalRecords: number;
  @Input() hospitalProfessionals$: Observable<any>;
}
