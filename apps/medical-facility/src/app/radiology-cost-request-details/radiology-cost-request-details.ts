import { Component } from '@angular/core';
import { RequestCard } from '@care-way/ui';

@Component({
  selector: 'medical-facility-radiology-cost-request-details',
  imports: [RequestCard],
  templateUrl: './radiology-cost-request-details.html',
  styleUrl: './radiology-cost-request-details.css',
})
export class RadiologyCostRequestDetails {

  route= '/dashboard/add-price-for-radiology'

}
