import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PageBody } from '@healbridge/ui';
import { MedicalProfessionalTable } from '../medical-professional-table/medical-professional-table';
import { ApiService, ProfessionalType } from '@healbridge/api';
import { Router } from '@angular/router';

@Component({
  selector: 'back-office-medical-professional-radiology',
  imports: [CommonModule, PageBody, MedicalProfessionalTable],
  templateUrl: './medical-professional-radiology.html',
  styleUrl: './medical-professional-radiology.css',
})
export class MedicalProfessionalRadiology {
  api = inject(ApiService);
  router = inject(Router);
  totalRecords = 0;
  professionalType = ProfessionalType.RadiologyStaff;

  view(item: any) {
    this.router.navigate([
      '/radiology-professional-details',
      item.professionalId,
    ]);
  }
}
