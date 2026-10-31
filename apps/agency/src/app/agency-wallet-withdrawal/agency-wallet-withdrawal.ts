import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, BankAccount } from '@care-way/api';
import { AuthService, ToastService } from '@care-way/shared';
import { WalletWithdraw } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';
import { v4 } from 'uuid';

@Component({
  selector: 'agency-agency-wallet-withdrawal',
  imports: [WalletWithdraw, IonContent],
  templateUrl: './agency-wallet-withdrawal.html',
  styleUrl: './agency-wallet-withdrawal.css',
})
export class AgencyWalletWithdrawal {
  public router = inject(Router);
  public api = inject(ApiService);
  public auth = inject(AuthService);
  private toast = inject(ToastService);

  walletId = v4();

  balance: number | undefined = 0;
  bankAcctId: string | undefined;
  userId: string;
  bankDetails: BankAccount[];
  loading = false;

  ionViewWillEnter() {
    this.userId = this.auth.getUserId();
    this.api.getWalletSummary().subscribe({
      next: (res) => {
        this.balance = res.balance;
      },
    });
    this.api
      .getBankAccount({
        referencedDocumentId: this.userId,
      })
      .subscribe({
        next: (res) => {
          this.bankDetails = res;
        },
      });
  }

  initiateWithdrawal(amount: number) {
    this.loading = true;
    this.api
      .withdrawFromWallet({
        withdrawalId: this.walletId,
        body: {
          bankAccountId: this.bankAcctId,
          amount: amount,
          walletWithdrawalId: this.walletId,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.navigateToOtp(amount);
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  selectBankAcct(event: string) {
    this.bankAcctId = event;
  }
  navigateToOtp(amount: number) {
    this.router.navigate(['dashboard', this.walletId, 'wallet-withdraw-otp'], {
      state: {
        amount,
      },
    });
  }

  back() {
    this.router.navigateByUrl('/dashboard/wallet-history');
  }
}
