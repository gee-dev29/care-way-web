import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { AddNewEntryCard, OrderCard, TransactionCard } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';
import { RiderWalletCard } from '../rider-wallet-card/rider-wallet-card';

@Component({
  selector: 'rider-rider-home',
  imports: [
    IonContent,
    OrderCard,
    RiderWalletCard,
    TransactionCard,
    AddNewEntryCard,
  ],
  templateUrl: './rider-home.html',
  styleUrl: './rider-home.css',
})
export class RiderHome implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  allData: any = [];
  riderId: any;
  transactions: any = [];
  balance: number | undefined = 0;

  ngOnInit(): void {
    this.riderId = this.auth.getUserId();
    this.api
      .getServiceRequestOrders({
        riderId: this.riderId,
        skip: 0,
        LimitSize: 1,
      } as any)
      .subscribe((response) => {
        this.allData = response.data;
      });

    this.api.getWalletSummary().subscribe({
      next: (res) => {
        this.balance = res.balance;
      },
    });
  }

  viewIt(item: any) {
    this.router.navigate([
      '/dashboard/order-details',
      item?.serviceRequestOrderId,
    ]);
  }
  viewAll() {
    this.router.navigate(['/dashboard/all-orders']);
  }

  navigateTo() {
    this.router.navigate(['dashboard', 'wallet-history']);
  }
}
