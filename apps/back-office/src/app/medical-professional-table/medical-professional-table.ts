import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { ApiService, ProfessionalType } from '@care-way/api';
import { Export } from '@care-way/shared';
import { DesktopButton } from '@care-way/ui';
import { TableModule } from 'primeng/table';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'back-office-medical-professional-table',
  imports: [CommonModule, TableModule, DesktopButton],
  templateUrl: './medical-professional-table.html',
  styleUrl: './medical-professional-table.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MedicalProfessionalTable {
  api = inject(ApiService);
  exportService = inject(Export);
  medicalProfessionals$: Observable<any>;
  totalRecords: number;
  filters: object;
  @Input() heading: string;
  @Input() professionalType: ProfessionalType;
  @Output() viewDetails = new EventEmitter<any>();
  type = ProfessionalType;

  view(item: any) {
    this.viewDetails.emit(item);
  }

  load(event: any) {
    this.filters = {
      skip: event.first,
      limit: event.rows,
      email: event.filters.email?.value || undefined,
    };
    this.getAllMedicalProfessionals();
  }

  getAllMedicalProfessionals() {
    this.medicalProfessionals$ = this.api
      .getMedicalProfessionals({
        professionalType: this.professionalType,
        ...this.filters,
      })
      .pipe(
        tap((response: any) => {
          this.totalRecords = response.totalRecords;
        }),
        map((response) => response.data)
      );
  }

  export() {
    this.api
      .getMedicalProfessionals({
        ...this.filters,
        limit: this.totalRecords,
        professionalType: this.professionalType,
      })
      .subscribe((professionals: any) => {
        this.exportService.exportExcel(
          professionals.data,
          this.professionalType
        );
      });
  }
}
