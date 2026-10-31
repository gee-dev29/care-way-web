import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DesktopButton, PageBody } from '@healbridge/ui';
import { MedicalProfessionalTable } from '../medical-professional-table/medical-professional-table';
import { ApiService, ProfessionalType } from '@healbridge/api';
import { Router } from '@angular/router';

@Component({
  selector: 'back-office-medical-professional-blood-bank',
  imports: [PageBody, CommonModule, MedicalProfessionalTable],
  templateUrl: './medical-professional-blood-bank.html',
  styleUrl: './medical-professional-blood-bank.css',
})
export class MedicalProfessionalBloodBank {
  api = inject(ApiService);
  router = inject(Router);
  totalRecords = 0;
  professionalType = ProfessionalType.BloodBankStaff;

  view(item: any) {
    this.router.navigate([
      '/bloodbank-professional-details',
      item.professionalId,
    ]);
  }
}
