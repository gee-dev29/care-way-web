import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import { WalletHistory } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'rider-rider-wallet-history',
  imports: [WalletHistory, IonContent],
  templateUrl: './rider-wallet-history.html',
  styleUrl: './rider-wallet-history.css',
})
export class RiderWalletHistory {
  public api = inject(ApiService);
  public auth = inject(AuthService);
  public router = inject(Router);

  myOrders: any = [];
  balance: number | undefined = 0;

  ionViewWillEnter() {
    this.api.getWalletSummary().subscribe({
      next: (res) => {
        this.balance = res.balance;
      },
    });
  }

  viewOrder(order: any) {
    this.router.navigateByUrl(
      `dashboard/wallet-transaction-type/${order.referenceId}/${order.type}`
    );
  }

  navigateTo() {
    this.router.navigateByUrl('/dashboard/home');
  }

  routeTo() {
    this.router.navigateByUrl(`dashboard/wallet-withdraw`);
  }
}
