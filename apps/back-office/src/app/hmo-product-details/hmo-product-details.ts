import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, ApprovalType } from '@healbridge/api';
import { PageBody, Tab } from '@healbridge/ui';
import { HmoDetailsCard } from '../hmo-details-card/hmo-details-card';
import { Observable, tap } from 'rxjs';
import { HmoProductDetailsCard } from '../hmo-product-details-card/hmo-product-details-card';
import { ApprovalButton } from '../approval-button/approval-button';
import { ApprovalTimeline } from '../approval-timeline/approval-timeline';
import { ApprovalQueries } from '../approval-queries/approval-queries';
import { ApprovalService } from '../../services/approval.service';

@Component({
  selector: 'back-office-hmo-product-details',
  imports: [
    CommonModule,
    PageBody,
    HmoDetailsCard,
    HmoProductDetailsCard,
    Tab,
    ApprovalButton,
    ApprovalTimeline,
    ApprovalQueries,
  ],
  templateUrl: './hmo-product-details.html',
  styleUrl: './hmo-product-details.css',
})
export class HmoProductDetails implements OnInit {
  router = inject(Router);
  api = inject(ApiService);
  activatedRoute = inject(ActivatedRoute);
  approvalService = inject(ApprovalService);

  hmoDetails$: Observable<any>;
  hmoProductDetails$: Observable<any>;

  activeTab = 0;
  tabs = [{ title: 'Details', value: 0, content: 'Details' }];

  hmoId: string;
  hmoProductId: string;
  approvalDescription = '';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.hmoId = params.hmoId;
      this.hmoProductId = params.hmoProductId;
      this.getHmoDetails(this.hmoId);
      this.getHmoProductDetails(this.hmoId, this.hmoProductId);
      this.approvalService.load(this.hmoProductId, ApprovalType.HmoProduct);
    });
  }

  editHmoDetails(item: any) {
    this.router.navigate(['create-hmo'], {
      queryParams: { ...item, hmoId: item.hmoId },
    });
  }

  getHmoDetails(hmoId: any) {
    this.hmoDetails$ = this.api.getHmo({ hmoId: hmoId });
  }

  getHmoProductDetails(hmoId: any, hmoProductId: any) {
    this.hmoProductDetails$ = this.api
      .getHmoProduct({
        hmoId: hmoId,
        hmoProductId: hmoProductId,
      })
      .pipe(
        tap((response: any) => {
          this.approvalDescription = `Product Name: ${response.productName} | Waiting Period: ${response.waitingPeriods} Days | Duration: ${response.durationInMonths} Months`;
        })
      );
  }

  back() {
    this.router.navigate(['hmo-details', this.hmoId]);
  }
}
