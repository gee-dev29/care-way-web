import { Component } from '@angular/core';
import { ReferralType } from '@care-way/api';
import { ServiceRequestTable } from '../service-request-table/service-request-table';

@Component({
  selector: 'back-office-list-all-radiology-centre-service-requests',
  imports: [ServiceRequestTable],
  templateUrl: './list-all-radiology-centre-service-requests.html',
  styleUrl: './list-all-radiology-centre-service-requests.css',
})
export class ListAllRadiologyCentreServiceRequests {
  type = ReferralType;
}
