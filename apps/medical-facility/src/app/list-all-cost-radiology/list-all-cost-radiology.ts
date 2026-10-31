import { Component } from '@angular/core';
import { FacilityType } from '@healbridge/api';
import { ListAllCost } from "@healbridge/ui";

@Component({
  selector: 'medical-facility-list-all-cost-radiology',
  imports: [ListAllCost],
  templateUrl: './list-all-cost-radiology.html',
  styleUrl: './list-all-cost-radiology.css',
})
export class ListAllCostRadiology {
facilityType = FacilityType
}
