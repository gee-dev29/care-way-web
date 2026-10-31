import {
  Component,
  EventEmitter,
  input,
  Output,
  output,
  signal,
} from '@angular/core';
import { IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'ui-reuseable-wallet-card',
  imports: [IonText, IonIcon],
  templateUrl: './reuseable-wallet-card.html',
  styleUrl: './reuseable-wallet-card.css',
})
export class ReuseableWalletCard {
  balance = input<any>();
  currency = input<string>('NGN');
  showHistory = input<boolean>(true);
  bgColor = input<string>('#E3F5E5');
  textColor = input<string>('#000');
  @Output() viewHistory = new EventEmitter<void>();
  isHidden = signal(false);

  constructor() {
    addIcons({ eyeOffOutline, eyeOutline });
  }
  toggleVisibility() {
    this.isHidden.update((v) => !v);
  }

  formatBalance(): string {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(this.balance());
  }

  maskedBalance(): string {
    return '*'.repeat(String(this.balance()).length);
  }
}
