import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-membership-card-table',
  imports: [CommonModule, TableModule],
  templateUrl: './membership-card-table.html',
  styleUrl: './membership-card-table.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MembershipCardTable {
  @Input() totalRecords: number;
  @Input() membershipCard$: Observable<any>;
}
