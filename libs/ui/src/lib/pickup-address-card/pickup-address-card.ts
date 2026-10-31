import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';

@Component({
  selector: 'ui-pickup-address-card',
  imports: [IonIcon],
  templateUrl: './pickup-address-card.html',
  styleUrl: './pickup-address-card.css',
})
export class PickupAddressCard {
  @Input() orders: any;
  @Input() totalItems: number;
  expanded = new Set<number>();

  constructor() {
    addIcons({
      'chevron-down-outline': chevronDownOutline,
      'chevron-up-outline': chevronUpOutline,
    });
  }

  toggle(index: number) {
    if (this.expanded.has(index)) {
      this.expanded.delete(index);
    } else {
      this.expanded.add(index);
    }
  }

  isExpanded(index: number) {
    return this.expanded.has(index);
  }
}
