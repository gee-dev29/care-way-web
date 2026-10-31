import { Component } from '@angular/core';
import { ReferralType } from '@healbridge/api';
import { ServiceRequestTable } from '../service-request-table/service-request-table';

@Component({
  selector: 'back-office-list-all-pharmacy-service-requests',
  imports: [ServiceRequestTable],
  templateUrl: './list-all-pharmacy-service-requests.html',
  styleUrl: './list-all-pharmacy-service-requests.css',
})
export class ListAllPharmacyServiceRequests {
  type = ReferralType;
}
