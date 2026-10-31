import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import { WalletWithdraw } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-med-wallet-withdrawal',
  imports: [WalletWithdraw, IonContent],
  templateUrl: './med-wallet-withdrawal.html',
  styleUrl: './med-wallet-withdrawal.css',
})
export class MedWalletWithdrawal {
  public router = inject(Router);
  public route = inject(ActivatedRoute);
  public api = inject(ApiService);
  public auth = inject(AuthService);

  facilityType: string | undefined;
  userId: string;
  balance: number | undefined = 0;
  bankAcctId: string | undefined;
  bankDetails: BankAccount[];
  walletId = v4();
  loading = false;
  facilityId: string;

  ionViewWillEnter() {
    this.userId = this.auth.getUserId();

    this.route.queryParams.subscribe((res: any) => {
      this.facilityType = res.facilityType;
      this.facilityId = res.facilityId;
    });

    this.api.getWalletSummary().subscribe({
      next: (res) => {
        this.balance = res.balance;
      },
    });

    this.api
      .getBankAccount({
        referencedDocumentId: this.facilityId,
      })
      .subscribe({
        next: (res) => {
          this.bankDetails = res.length ? res : [];
        },
      });
  }

  selectBankAcct(event: string) {
    this.bankAcctId = event;
  }

  initiateWithdrawal(amount: any) {
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
        next: (res) => {
          this.loading = false;
          this.navigateToOtp(amount);
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  navigateToOtp(amount: any) {
    this.router.navigate(
      [
        'dashboard',
        this.walletId,
        'wallet-withdraw-otp',
        this.facilityType,
        this.facilityId,
      ],
      {
        state: {
          amount,
        },
      }
    );
  }

  navigateTo() {
    this.router.navigateByUrl(
      `dashboard/${this.facilityType}/wallet-history/${this.facilityId}`
    );
  }
}

interface BankAccount {
  accountName?: string;
  accountNumber?: number;
  bank?: string;
  bankAccountId?: string;
  bankCode?: string;
  referencedDocumentId?: string;
}
