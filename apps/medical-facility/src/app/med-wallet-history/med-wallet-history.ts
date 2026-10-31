import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import { WalletHistory } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-med-wallet-history',
  imports: [WalletHistory, IonContent],
  templateUrl: './med-wallet-history.html',
  styleUrl: './med-wallet-history.css',
})
export class MedWalletHistory {
  public api = inject(ApiService);
  public auth = inject(AuthService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  myOrders: any = [];
  balance: number | undefined = 0;
  facilityType: string | undefined;
  userTypeId: string | undefined;
  facilityId: string | undefined;

  ionViewWillEnter() {
    this.route.params.subscribe((param: Params) => {
      this.facilityType = param['facilityType'];
      this.facilityId = param['facilityId'];
      this.userTypeId = param['userTypeId'];
    });

    this.api.getWalletSummary().subscribe({
      next: (res) => {
        this.balance = res.balance;
      },
    });
  }

  viewOrder(order: any) {
    this.router.navigateByUrl(
      `dashboard/wallet-transaction-type/${order.referenceId}/${this.facilityType}/${this.facilityId}`
    );
  }

  navigateTo() {
    this.router.navigateByUrl('/dashboard/home');
  }

  routeTo() {
    this.router.navigate(['dashboard/wallet-withdrawal'], {
      queryParams: {
        facilityType: this.facilityType,
        facilityId: this.facilityId,
      },
    });
  }
}
