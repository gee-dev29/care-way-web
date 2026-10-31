import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import moment from 'moment';

@Component({
  selector: 'ui-order-card',
  imports: [IonIcon, CommonModule, IonSkeletonText],
  templateUrl: './order-card.html',
  styleUrl: './order-card.css',
})
export class OrderCard {
  @Input() title: string;
  @Input() order: any;
  @Input() background: any;
  @Input() showAmount = true;
  @Input() makeOrange = false;
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

  get statusColor() {
    if (this.order?.status?.toLowerCase() === 'delivered' && this.makeOrange) {
      return '#f3951f';
    } else if (
      this.order?.status?.toLowerCase() === 'delivered' &&
      !this.makeOrange
    ) {
      return '#2f8f46';
    } else {
      return '#f3951f';
    }
  }
}
