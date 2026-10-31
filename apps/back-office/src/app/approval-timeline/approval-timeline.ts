import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
} from '@angular/core';
import { ApprovalState } from '@care-way/shared';
import moment from 'moment';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { ApprovalService } from '../../services/approval.service';

@Component({
  selector: 'back-office-approval-timeline',
  imports: [CommonModule, SkeletonModule, TooltipModule],
  templateUrl: './approval-timeline.html',
  styleUrl: './approval-timeline.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ApprovalTimeline {
  approvalService = inject(ApprovalService);
  @Input() cardHeading = 'Approval Timeline';
  approval$ = this.approvalService.approval$;
  loading$ = this.approvalService.loading$;
  moment = moment;
  skeletonRows = [1, 2, 3];
  expanded = false;
  statusBadges: Record<string, { label: string; tone: string }> = {
    [ApprovalState.Active]: { label: 'In Progress', tone: 'pending' },
    [ApprovalState.Completed]: { label: 'Approved', tone: 'approved' },
    [ApprovalState.Rejected]: { label: 'Rejected', tone: 'rejected' },
  };

  getApprovedCount(steps: any[]) {
    return steps.filter((step) => step.state === 'approved').length;
  }

  getProgress(steps: any[]) {
    return steps.length
      ? Math.round((this.getApprovedCount(steps) / steps.length) * 100)
      : 0;
  }
}
