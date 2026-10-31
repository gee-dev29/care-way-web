import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-staff-details-card',
  imports: [CommonModule],
  templateUrl: './staff-details-card.html',
  styleUrl: './staff-details-card.css',
})
export class StaffDetailsCard {
  @Input() staffDetails$: Observable<any>;
  @Input() totalRecords = 0;
}
