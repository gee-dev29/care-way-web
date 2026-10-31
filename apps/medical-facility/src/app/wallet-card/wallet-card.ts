import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonIcon, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  eyeOffSharp,
  eyeOutline,
  eyeSharp,
  walletOutline,
} from 'ionicons/icons';

@Component({
  selector: 'medical-facility-wallet-card',
  imports: [IonIcon, CommonModule, CurrencyPipe],
  templateUrl: './wallet-card.html',
  styleUrl: './wallet-card.css',
})
export class WalletCard {
  @Input() amount = 0;
  @Input() hiddenAmmount = '';
  @Input() title = '';
  @Input() pharmacyName = '';
  displayMoney = true;
  isReady = false;

  constructor() {
    addIcons({
      walletOutline,
      'eye-sharp': eyeSharp,
      'eye-off-sharp': eyeOffSharp,
    });
    this.isReady = true;
  }

  visible() {
    this.displayMoney = !this.displayMoney;
  }
}
