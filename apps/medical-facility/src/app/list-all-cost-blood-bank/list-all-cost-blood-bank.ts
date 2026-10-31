import { Component } from '@angular/core';
import { FacilityType } from '@care-way/api';
import { ListAllCost } from "@care-way/ui";

@Component({
  selector: 'medical-facility-list-all-cost-blood-bank',
  imports: [ListAllCost],
  templateUrl: './list-all-cost-blood-bank.html',
  styleUrl: './list-all-cost-blood-bank.css',
})
export class ListAllCostBloodBank {
facilityType = FacilityType
}
