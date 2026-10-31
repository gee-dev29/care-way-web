import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { WalletFlow, WalletFlowType } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';
@Component({
  selector: 'rider-credit-or-debit-details',
  imports: [IonContent, WalletFlow],
  templateUrl: './credit-or-debit-details.html',
  styleUrl: './credit-or-debit-details.css',
})
export class CreditOrDebitDetails implements OnInit {
  private router = inject(Router);
  private actRoute = inject(ActivatedRoute);
  private api = inject(ApiService);

  flowId: string;
  flowType: WalletFlowType;
  data: any = {};
  isLoading = true;

  ngOnInit(): void {
    this.actRoute.params.subscribe((params: Params) => {
      this.flowId = params['flowId'];
      this.flowType = params['flowType'];
    });
  }

  ionViewWillEnter() {
    this.getTransactionDetails();
  }

  getTransactionDetails() {
    this.isLoading = true;
    this.api.getInflow({ inflowId: this.flowId }).subscribe({
      next: (res) => {
        this.data = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  routeTo = (url: string) => {
    this.router.navigate([url]);
  };
}
