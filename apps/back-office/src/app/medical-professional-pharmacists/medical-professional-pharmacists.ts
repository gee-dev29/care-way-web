import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ApiService, ProfessionalType } from '@care-way/api';
import { DesktopButton, PageBody } from '@care-way/ui';
import { TableModule } from 'primeng/table';
import { MedicalProfessionalTable } from '../medical-professional-table/medical-professional-table';
import { Router } from '@angular/router';

@Component({
  selector: 'back-office-medical-professional-pharmacists',
  imports: [PageBody, CommonModule, TableModule, MedicalProfessionalTable],
  templateUrl: './medical-professional-pharmacists.html',
  styleUrl: './medical-professional-pharmacists.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MedicalProfessionalPharmacists {
  api = inject(ApiService);
  router = inject(Router);
  totalRecords = 0;
  professionalType = ProfessionalType.Pharmacist;

  view(item: any) {
    this.router.navigate(['/pharmacist-details', item.professionalId]);
  }
}
