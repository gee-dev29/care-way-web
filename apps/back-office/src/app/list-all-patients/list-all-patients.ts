import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import moment from 'moment';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-list-all-patients',
  imports: [CommonModule, TableModule],
  templateUrl: './list-all-patients.html',
  styleUrl: './list-all-patients.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListAllPatients {
  @Input() patients$: Observable<any>;
  @Input() totalRecords: number;
}
