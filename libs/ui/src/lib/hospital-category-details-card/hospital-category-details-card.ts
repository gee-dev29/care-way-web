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
import { FacilityType } from '../models/action.model';
import { DesktopButton } from '../desktop-button/desktop-button';

@Component({
  selector: 'ui-hospital-category-details-card',
  imports: [CommonModule, TableModule, DesktopButton],
  templateUrl: './hospital-category-details-card.html',
  styleUrl: './hospital-category-details-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HospitalCategoryDetailsCard {
  @Input() medicalFacilities$: Observable<any>;
  @Input() totalRecords = 0;
  @Input() currentFacilityType: any;
  @Output() viewDetails = new EventEmitter<Event>();
  type = FacilityType;

  view(item: any) {
    this.viewDetails.emit(item);
  }
}
