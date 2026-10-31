import { Component } from '@angular/core';
import { ReferralType } from '@care-way/api';
import { ServiceRequestTable } from '../service-request-table/service-request-table';

@Component({
  selector: 'back-office-list-all-blood-bank-service-requests',
  imports: [ServiceRequestTable],
  templateUrl: './list-all-blood-bank-service-requests.html',
  styleUrl: './list-all-blood-bank-service-requests.css',
})
export class ListAllBloodBankServiceRequests {
  type = ReferralType;
}
