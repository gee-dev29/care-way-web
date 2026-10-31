import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MedicalFacilityTable } from '../medical-facility-table/medical-facility-table';
import { FacilityType } from '@healbridge/api';
import { Router } from '@angular/router';

@Component({
  selector: 'back-office-list-all-blood-banks',
  imports: [CommonModule, MedicalFacilityTable],
  templateUrl: './list-all-blood-banks.html',
  styleUrl: './list-all-blood-banks.css',
})
export class ListAllBloodBanks {
  router = inject(Router);
  type = FacilityType;

  view(item: any) {
    this.router.navigate([
      'blood-bank-details',
      item.facilityId,
      item.bloodBankId,
      item.facilityType,
    ]);
  }
}
