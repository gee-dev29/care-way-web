import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import moment from 'moment';

@Component({
  selector: 'ui-transaction-card',
  imports: [IonIcon, CommonModule, IonSkeletonText],
  templateUrl: './transaction-card.html',
  styleUrl: './transaction-card.css',
})
export class TransactionCard {
  @Input() title: string;
  @Input() transaction: any;
  @Input() background: any;
  @Output() view = new EventEmitter();
  @Output() viewIt = new EventEmitter();
  moment = moment;

  constructor() {
    addIcons({
      'chevron-forward-outline': chevronForwardOutline,
    });
  }

  viewAll() {
    this.view.emit();
  }
}
