import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService, environment } from '@care-way/shared';
import { AddAddress } from '@care-way/ui';

@Component({
  selector: 'app-dashboard-prescription-add-address',
  imports: [AddAddress],
  templateUrl: './dashboard-prescription-add-address.html',
  styleUrl: './dashboard-prescription-add-address.css',
})
export class DashboardPrescriptionAddAddress implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  public api = inject(ApiService);
  referencedDocumentId: any;
  navigateTo: string;
  onContinue: string;
  costFlow: string;
  apiKey = environment.mapKey;
  serviceRequestId: string;
  orderId: string;

  ngOnInit(): void {
    this.auth.userDetail(this.api, (auth) => {
      this.referencedDocumentId = auth?.jti;
      this.route.params.subscribe((params: any) => {
        this.costFlow = params.flow;
        this.serviceRequestId = params.serviceRequestId;
        this.orderId = params.orderId;
        if (this.orderId) {
          this.navigateTo =
            this.navigateTo = `/dashboard/address/${this.costFlow}/${this.serviceRequestId}/${this.orderId}`;
        } else {
          this.navigateTo =
            this.navigateTo = `/dashboard/address/${this.costFlow}/${this.serviceRequestId}`;
        }
      });
    });
  }
}
