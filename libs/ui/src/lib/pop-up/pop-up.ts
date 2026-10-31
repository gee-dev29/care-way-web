import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonModal, IonIcon } from '@ionic/angular/standalone';
import { ButtonComponent } from '../button/button.component';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'ui-pop-up',
  imports: [IonModal, ButtonComponent, IonIcon],
  templateUrl: './pop-up.html',
  styleUrl: './pop-up.css',
})
export class PopUp {
  @Input() open = false;
  @Output() continue = new EventEmitter();
  @Output() cancell = new EventEmitter();

  constructor() {
    addIcons({
      close,
    });
  }
}
