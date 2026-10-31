import { Component } from '@angular/core';
import { FacilityType } from '@healbridge/api';
import { ListAllCost } from "@healbridge/ui";

@Component({
  selector: 'medical-facility-list-all-cost-blood-bank',
  imports: [ListAllCost],
  templateUrl: './list-all-cost-blood-bank.html',
  styleUrl: './list-all-cost-blood-bank.css',
})
export class ListAllCostBloodBank {
facilityType = FacilityType
}
