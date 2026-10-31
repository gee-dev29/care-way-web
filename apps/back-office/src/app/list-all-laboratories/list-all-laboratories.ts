import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MedicalFacilityTable } from '../medical-facility-table/medical-facility-table';
import { FacilityType } from '@healbridge/api';
import { Router } from '@angular/router';

@Component({
  selector: 'back-office-list-all-laboratories',
  imports: [CommonModule, MedicalFacilityTable],
  templateUrl: './list-all-laboratories.html',
  styleUrl: './list-all-laboratories.css',
})
export class ListAllLaboratories {
  router = inject(Router);
  type = FacilityType;

  view(item: any) {
    this.router.navigate([
      'laboratory-details',
      item.facilityId,
      item.laboratoryId,
      item.facilityType,
    ]);
  }
}
