import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MedicalFacilityTable } from '../medical-facility-table/medical-facility-table';
import { FacilityType } from '@care-way/api';
import { Router } from '@angular/router';

@Component({
  selector: 'back-office-list-all-hospitals',
  imports: [CommonModule, MedicalFacilityTable],
  templateUrl: './list-all-hospitals.html',
  styleUrl: './list-all-hospitals.css',
})
export class ListAllHospitals {
  router = inject(Router);
  type = FacilityType;

  viewDetails(item: any) {
    this.router.navigate([
      '/hospital-details',
      item.facilityId,
      item.hospitalId,
      item.facilityType,
    ]);
  }
}
