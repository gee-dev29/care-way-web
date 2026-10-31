import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { PageBody } from '@healbridge/ui';
import { ApprovalRouteCard } from '../approval-route-card/approval-route-card';
import { Observable, tap } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'back-office-approval-route-details',
  imports: [PageBody, ApprovalRouteCard, CommonModule],
  templateUrl: './approval-route-details.html',
  styleUrl: './approval-route-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ApprovalRouteDetails implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  api = inject(ApiService);

  approvalRouteDetails$: Observable<any>;
  approvalRouteId: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      if (params.approvalRouteId) {
        this.approvalRouteId = params.approvalRouteId;
        this.getApprovalRoute(this.approvalRouteId);
      }
    });
  }

  getApprovalRoute(approvalRouteId: string) {
    this.approvalRouteDetails$ = this.api
      .getApprovalRoute({
        approvalRouteId: approvalRouteId,
      })
  }

  edit(approvalRouteId: string) {
    this.router.navigate(['create-approval-route', approvalRouteId]);
  }

  back() {
    this.router.navigate(['list-all-approval-routes']);
  }
}
