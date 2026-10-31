import { Component, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { WalletHistory } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-doctor-wallet-history',
  imports: [WalletHistory, IonContent],
  templateUrl: './doctor-wallet-history.html',
  styleUrl: './doctor-wallet-history.css',
})
export class DoctorWalletHistory {
  public api = inject(ApiService);
  public auth = inject(AuthService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  myOrders: any = [];
  balance: number | undefined = 0;
  professionalId: string | undefined;

  ionViewWillEnter() {
    this.route.params.subscribe((param: Params) => {
      this.professionalId = param['professionalId'];
    });

    this.api.getWalletSummary().subscribe({
      next: (res) => {
        this.balance = res.balance;
      },
    });
  }

  viewOrder(order: any) {
    this.router.navigateByUrl(
      `doctor-dashboard/${this.professionalId}/wallet-transaction-type/${order.referenceId}/${order.type}`
    );
  }

  navigateTo() {
    this.router.navigateByUrl(`doctor-dashboard/${this.professionalId}`);
  }

  routeTo() {
    this.router.navigateByUrl(
      `doctor-dashboard/${this.professionalId}/wallet-withdrawal`
    );
  }
}
