import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonCard, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOffSharp, eyeSharp } from 'ionicons/icons';

@Component({
  selector: 'ui-wallet-card',
  imports: [IonCard, IonIcon, IonText, TitleCasePipe],
  templateUrl: './wallet-card.html',
  styleUrl: './wallet-card.css',
})
export class WalletCard {
  private router = inject(Router);
  @Input() balance: number | undefined;
  @Input() title = 'Available Balance';
  @Input() subtitle = '';
  @Input() facilityType: string;
  @Input() facilityId: string;
  @Input() historyRoute: any[] | undefined;
  @Input() bg: string;
  @Input() color = 'white';
  @Input() showBalance = true;
  @Output() toggleVisibility = new EventEmitter<boolean>();
  @Output() navigateTo = new EventEmitter<void>();
  displayMoney = true;

  constructor() {
    addIcons({
      eyeSharp,
      eyeOffSharp,
    });
  }

  toggle() {
    this.showBalance = !this.showBalance;
    this.displayMoney = !this.displayMoney;
    this.toggleVisibility.emit(this.showBalance);
  }

  get formattedBalance() {
    return this.balance?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  navigate() {
    if (this.historyRoute) {
      this.router.navigate(this.historyRoute);
      return;
    }
    this.router.navigate([
      '/dashboard',
      this.facilityType,
      'wallet-history',
      this.facilityId,
    ]);
  }
}
