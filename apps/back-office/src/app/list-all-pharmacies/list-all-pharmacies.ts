import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { MedicalFacilityTable } from '../medical-facility-table/medical-facility-table';
import { FacilityType } from '@healbridge/api';
import { Router } from '@angular/router';

@Component({
  selector: 'back-office-list-all-pharmacies',
  imports: [CommonModule, MedicalFacilityTable],
  templateUrl: './list-all-pharmacies.html',
  styleUrl: './list-all-pharmacies.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListAllPharmacies {
  router = inject(Router);
  type = FacilityType;

  view(item: any) {
    this.router.navigate([
      'pharmacy-details',
      item.facilityId,
      item.pharmacyId,
      item.facilityType,
    ]);
  }
}
