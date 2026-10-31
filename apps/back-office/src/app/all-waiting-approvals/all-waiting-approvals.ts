import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageBody } from '@healbridge/ui';
import { ApprovalTable } from '../approval-table/approval-table';

@Component({
  selector: 'back-office-all-waiting-approvals',
  imports: [PageBody, ApprovalTable],
  templateUrl: './all-waiting-approvals.html',
  styleUrl: './all-waiting-approvals.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AllWaitingApprovals {

}
