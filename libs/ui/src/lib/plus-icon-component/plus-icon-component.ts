import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'ui-plus-icon-component',
  imports: [IonIcon],
  templateUrl: './plus-icon-component.html',
  styleUrl: './plus-icon-component.css',
})
export class PlusIconComponent {
  @Input() size: string;
  @Output() addIdentity = new EventEmitter<Event>();
}
