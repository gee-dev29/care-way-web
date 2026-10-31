import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { MedicalFacilityTable } from '../medical-facility-table/medical-facility-table';
import { FacilityType } from '@care-way/api';
import { Router } from '@angular/router';

@Component({
  selector: 'back-office-list-all-radiology-centres',
  imports: [CommonModule, MedicalFacilityTable],
  templateUrl: './list-all-radiology-centres.html',
  styleUrl: './list-all-radiology-centres.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListAllRadiologyCentres {
  router = inject(Router);
  type = FacilityType;

  view(item: any) {
    this.router.navigate([
      'radiology-details',
      item.facilityId,
      item.radiologyId,
      item.facilityType,
    ]);
  }
}
