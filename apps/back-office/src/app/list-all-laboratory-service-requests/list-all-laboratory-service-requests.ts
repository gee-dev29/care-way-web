import { Component } from '@angular/core';
import { ServiceRequestTable } from '../service-request-table/service-request-table';
import { ReferralType } from '@care-way/api';

@Component({
  selector: 'back-office-list-all-laboratory-service-requests',
  imports: [ServiceRequestTable],
  templateUrl: './list-all-laboratory-service-requests.html',
  styleUrl: './list-all-laboratory-service-requests.css',
})
export class ListAllLaboratoryServiceRequests {
  type = ReferralType;
}
