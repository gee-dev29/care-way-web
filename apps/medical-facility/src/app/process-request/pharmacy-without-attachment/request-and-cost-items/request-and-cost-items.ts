import { Component } from '@angular/core';
import { AllRequestDetails } from '../all-request-details/all-request-details';

@Component({
  selector: 'medical-facility-request-and-cost-items',
  imports: [AllRequestDetails],
  templateUrl: './request-and-cost-items.html',
  styleUrl: './request-and-cost-items.css',
})
export class RequestAndCostItems {}
