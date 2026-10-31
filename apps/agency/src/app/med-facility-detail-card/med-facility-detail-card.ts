import { Component, input } from '@angular/core';
import { IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'agency-med-facility-detail-card',
  imports: [IonText],
  templateUrl: './med-facility-detail-card.html',
  styleUrl: './med-facility-detail-card.css',
})
export class MedFacilityDetailCard {
  location = input<string>();
  name = input<string>();
  email = input<string>();
}
