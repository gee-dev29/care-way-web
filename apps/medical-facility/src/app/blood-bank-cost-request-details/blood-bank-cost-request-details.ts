import { Component } from '@angular/core';
import { RequestCard } from '@care-way/ui';

@Component({
  selector: 'medical-facility-blood-bank-cost-request-details',
  imports: [RequestCard],
  templateUrl: './blood-bank-cost-request-details.html',
  styleUrl: './blood-bank-cost-request-details.css',
})
export class BloodBankCostRequestDetails {
route= '/dashboard/add-price-for-blood-bank'
card= '#FFF0F0'
track = '#EF3B3F'
button='danger'
}
