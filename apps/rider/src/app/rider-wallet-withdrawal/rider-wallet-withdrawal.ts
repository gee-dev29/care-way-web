import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, BankAccount } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { WalletWithdraw } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';
import { v4 } from 'uuid';

@Component({
  selector: 'rider-rider-wallet-withdrawal',
  imports: [WalletWithdraw, IonContent],
  templateUrl: './rider-wallet-withdrawal.html',
  styleUrl: './rider-wallet-withdrawal.css',
})
export class RiderWalletWithdrawal {
  public router = inject(Router);
  public api = inject(ApiService);
  public auth = inject(AuthService);

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
          this.bankDetails = res.length ? res : [];
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
        next: () => {
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
        // withdrawalId: this.walletId,
      },
    });
  }

  back() {
    this.router.navigateByUrl('/dashboard/wallet-history');
  }
}
