import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon, IonImg } from '@ionic/angular/standalone';
import { eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'ui-fee-list-card',
  imports: [IonIcon, IonImg, TitleCasePipe],
  templateUrl: './fee-list-card.html',
  styleUrl: './fee-list-card.css',
})
export class FeeListCard {
  @Input() fees: any[] = [];
  @Input() title = 'Consultation Fees';
  @Output() viewFee = new EventEmitter<any>();

  eyeIcon = eyeOutline;
}
