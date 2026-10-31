import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { PageBody, DesktopButton } from '@healbridge/ui';
import { MedicalProfessionalTable } from '../medical-professional-table/medical-professional-table';
import { ApiService, ProfessionalType } from '@healbridge/api';
import { Router } from '@angular/router';

@Component({
  selector: 'back-office-medical-professional-lab',
  imports: [PageBody, CommonModule, MedicalProfessionalTable],
  templateUrl: './medical-professional-lab.html',
  styleUrl: './medical-professional-lab.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MedicalProfessionalLab {
  api = inject(ApiService);
  router = inject(Router);
  totalRecords = 0;
  professionalType = ProfessionalType.LaboratoryStaff;

  view(item: any) {
    this.router.navigate([
      'laboratory-professional-details',
      item.professionalId,
    ]);
  }
}
