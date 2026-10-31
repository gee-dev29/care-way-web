import { CommonModule, Location } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, ReferralType } from '@healbridge/api';
import { AuthService, CostFlow } from '@healbridge/shared';
import { UploadComponent } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';
import { v4 } from 'uuid';

@Component({
  selector: 'app-dashboard-cost-flow',
  imports: [UploadComponent, IonContent, CommonModule],
  templateUrl: './dashboard-cost-flow.html',
  styleUrl: './dashboard-cost-flow.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardCostFlow implements OnInit {
  private route = inject(ActivatedRoute);
  public api = inject(ApiService);
  public auth = inject(AuthService);
  private router = inject(Router);
  headerTitle: string;
  heading: string;
  referencedDocumentId: any;
  navigateTo: string;
  memberId: string;
  referral = ReferralType;
  referralType: any;
  uploadedDocument = '';

  ngOnInit() {
    this.auth.userDetail(this.api, (auth) => {
      this.referencedDocumentId = auth?.jti;
      this.route.params.subscribe((params: any) => {
        this.headerTitle = params.flow;
        this.referencedDocumentId = params.serviceRequestId;
        this.heading = `Save ${this.headerTitle}`;
        this.navigateTo = `/dashboard/uploaded-prescription/${this.headerTitle}/${params.serviceRequestId}`;
      });
    });
  }

  goBack(route: any) {
    this.router.navigateByUrl('/dashboard/prescription');
  }
}
