import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import moment from 'moment';

@Component({
  selector: 'ui-fufil-card',
  imports: [IonImg, IonIcon],
  templateUrl: './fufil-card.html',
  styleUrl: './fufil-card.css',
})
export class FufilCard {
  @Input() bg = '#ffffff';
  @Input() viewAllColor = '#007bff';
  @Input() bdColor = 'none';
  @Input() header = true;
  @Input() order: any;
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
