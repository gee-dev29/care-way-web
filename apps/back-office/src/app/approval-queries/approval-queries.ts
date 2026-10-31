import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '@healbridge/api';
import { DesktopButton } from '@healbridge/ui';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TextareaModule } from 'primeng/textarea';
import { ApprovalService } from '../../services/approval.service';

@Component({
  selector: 'back-office-approval-queries',
  imports: [CommonModule, ReactiveFormsModule, DesktopButton, TextareaModule],
  templateUrl: './approval-queries.html',
  styleUrl: './approval-queries.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ApprovalQueries {
  api = inject(ApiService);
  toastr = inject(ToastrService);
  approvalService = inject(ApprovalService);
  @Input() cardHeading = 'Queries';
  queries$ = this.approvalService.queries$;
  moment = moment;
  loading = false;
  respondingId: string | null = null;
  response = new FormControl('', Validators.required);

  formatDate(date: string) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return moment(date, 'YYYY-MM-DD').format('MMM DD, YYYY');
    }
    return moment.utc(date).local().format('MMM DD, YYYY h:mm A');
  }

  openResponse(queryId: string) {
    this.response.reset();
    this.respondingId = queryId;
  }

  cancelResponse() {
    this.respondingId = null;
  }

  respondToQuery() {
    if (!this.respondingId || this.response.invalid) return;
    this.loading = true;
    this.api
      .respondToQuery({
        referencedDocumentId: this.approvalService.documentId,
        body: {
          queryId: this.respondingId,
          response: this.response.value ?? '',
          approvalType: this.approvalService.approvalType,
        },
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.respondingId = null;
          this.toastr.success('Response sent');
          this.approvalService.refreshQueries();
        },
        error: () => (this.loading = false),
      });
  }
}
