import { Component, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { WalletWithdraw } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-doctor-wallet-withdrawal',
  imports: [WalletWithdraw, IonContent],
  templateUrl: './doctor-wallet-withdrawal.html',
  styleUrl: './doctor-wallet-withdrawal.css',
})
export class DoctorWalletWithdrawal {
  public router = inject(Router);
  public route = inject(ActivatedRoute);
  public api = inject(ApiService);
  public auth = inject(AuthService);

  professionalId: string | undefined;
  userId: string;
  balance: number | undefined = 0;
  bankAcctId: string | undefined;
  bankDetails: any = [];
  walletId = v4();
  loading = false;

  ionViewWillEnter() {
    this.userId = this.auth.getUserId();

    this.route.params.subscribe((param: Params) => {
      this.professionalId = param['professionalId'];
    });

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

  navigateToOtp(amount: any) {
    this.router.navigate(
      [
        'doctor-dashboard',
        this.professionalId,
        this.walletId,
        'wallet-withdraw-otp',
      ],
      {
        state: {
          amount,
        },
      }
    );
  }

  addBank() {
    this.router.navigate(
      [`doctor-dashboard/${this.professionalId}/add-doctor-bank`],
      {
        state: {
          backRoute: `doctor-dashboard/${this.professionalId}/wallet-withdrawal`,
        },
      }
    );
  }

  navigateTo() {
    this.router.navigateByUrl(
      `doctor-dashboard/${this.professionalId}/wallet-history`
    );
  }
}
