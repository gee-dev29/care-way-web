import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import { IonText, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cardOutline, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '@care-way/shared';
import { ButtonComponent } from '@care-way/ui';
@Component({
  selector: 'rider-wallet-card',
  imports: [IonText, IonIcon, ButtonComponent],
  templateUrl: './rider-wallet-card.html',
  styleUrl: './rider-wallet-card.css',
})
export class RiderWalletCard {
  public router = inject(Router);
  public auth = inject(AuthService);

  balance = input<any>();
  currency = input<string>('NGN');
  showHistory = input<boolean>(true);
  bgColor = input<string>('#E3F5E5');
  textColor = input<string>('#000');
  btnColor = input<string>('#307d3d');
  @Output() viewHistory = new EventEmitter<void>();
  isHidden = signal(false);

  constructor() {
    addIcons({ eyeOffOutline, eyeOutline, cardOutline });
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
