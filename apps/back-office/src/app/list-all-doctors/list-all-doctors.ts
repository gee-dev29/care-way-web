import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, ProfessionalType } from '@healbridge/api';
import { PageBody, DesktopButton } from '@healbridge/ui';
import { TableModule } from 'primeng/table';
import { map, Observable, tap } from 'rxjs';
import { MedicalProfessionalTable } from '../medical-professional-table/medical-professional-table';

@Component({
  selector: 'back-office-list-all-doctors',
  imports: [
    PageBody,
    CommonModule,
    TableModule,
    TableModule,
    MedicalProfessionalTable,
  ],
  templateUrl: './list-all-doctors.html',
  styleUrl: './list-all-doctors.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListAllDoctors {
  api = inject(ApiService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  professionalId: string;
  professionalType = ProfessionalType.Doctor;
  totalRecords = 0;

  view(item: any) {
    this.router.navigate(['/doctor-details', item.professionalId]);
  }
}
