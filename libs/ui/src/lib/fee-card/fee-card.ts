import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'ui-fee-card',
  imports: [IonImg, DecimalPipe, TitleCasePipe],
  templateUrl: './fee-card.html',
  styleUrl: './fee-card.css',
})
export class FeeCard {
  @Input() fee: any;
}
