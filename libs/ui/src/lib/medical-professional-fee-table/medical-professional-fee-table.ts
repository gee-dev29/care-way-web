import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { DesktopButton } from '../desktop-button/desktop-button';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-medical-professional-fee-table',
  imports: [CommonModule, TableModule, DesktopButton],
  templateUrl: './medical-professional-fee-table.html',
  styleUrl: './medical-professional-fee-table.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MedicalProfessionalFeeTable {
  @Input() medicalProfessionalFees$: Observable<any>;
  @Input() totalRecords = 0;
  @Output() showModalFee = new EventEmitter<void>();

  setFee(item: any) {
    this.showModalFee.emit(item.facilityTypeId);
  }
}
