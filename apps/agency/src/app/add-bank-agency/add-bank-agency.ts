import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { SharedAddBank } from '@healbridge/ui';
@Component({
  selector: 'agency-add-bank-agency',
  imports: [SharedAddBank],
  templateUrl: './add-bank-agency.html',
  styleUrl: './add-bank-agency.css',
})
export class AddBankAgency {
  public api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  agentId: string;
  route: any;
  backRoute: any;

  ionViewWillEnter() {
    this.activatedRoute.params.subscribe((params) => {
      this.agentId = params['agentId'];

      if (params['edit'] || this.router.url.includes('profile')) {
        this.route = 'dashboard/bank-account';
        this.backRoute = 'dashboard/bank-account';
      } else {
        this.route = `/dashboard/home`;
        this.backRoute = `/dashboard/home`;
      }
    });
  }
}
