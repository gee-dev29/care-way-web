import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import moment from 'moment';

export type WalletFlowType = 'Inflow' | 'OutFlow';

@Component({
  selector: 'ui-wallet-flow',
  imports: [IonIcon, IonSkeletonText],
  templateUrl: './wallet-flow.html',
  styleUrl: './wallet-flow.css',
})
export class WalletFlow {
  moment = moment;
  @Input() type: WalletFlowType = 'Inflow';
  @Input() data: any = {};
  @Input() loading = false;
  @Output() back = new EventEmitter<void>();

  constructor() {
    addIcons({ chevronBackOutline });
  }

  get isInflow(): boolean {
    return this.type === 'Inflow';
  }

  get statusClass(): string {
    const status = (this.data?.status || '').toLowerCase();
    if (status.includes('declin') || status.includes('fail')) {
      return 'declined';
    }
    if (status.includes('pending')) {
      return 'pending';
    }
    return 'approved';
  }
}
