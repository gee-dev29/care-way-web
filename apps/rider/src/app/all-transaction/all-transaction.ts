import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { TransactionCard } from '@healbridge/ui';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonImg,
  IonSearchbar,
  IonChip,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'rider-all-transaction',
  imports: [IonContent, IonSearchbar, CommonModule, IonChip, TransactionCard],
  templateUrl: './all-transaction.html',
  styleUrl: './all-transaction.css',
})
export class AllTransaction {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  statuses: string[] = ['All', 'Credit', 'Debit', 'Declined'];
  selectedItem = 'All';
  transactions: any = [];

  search(text: any) {
    //
  }

  selectStatus(status: string) {
    this.selectedItem = status;
  }

  route(transaction: any) {
    this.router.navigate(['/dashboard/transaction-details', transaction.id]);
  }
}
