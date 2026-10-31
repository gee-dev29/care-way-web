import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageBody } from '@healbridge/ui';
import { ApprovalTable } from '../approval-table/approval-table';

@Component({
  selector: 'back-office-all-pending-approvals',
  imports: [CommonModule, PageBody, ApprovalTable],
  templateUrl: './all-pending-approvals.html',
  styleUrl: './all-pending-approvals.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AllPendingApprovals {

}
