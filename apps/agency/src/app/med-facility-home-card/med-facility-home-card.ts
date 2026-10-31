import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  callOutline,
  chevronForwardOutline,
  locationOutline,
  mailOutline,
} from 'ionicons/icons';
import moment from 'moment';

@Component({
  selector: 'agency-med-facility-home-card',
  imports: [IonIcon, IonSkeletonText],
  templateUrl: './med-facility-home-card.html',
  styleUrl: './med-facility-home-card.css',
})
export class MedFacilityHomeCard {
  @Input() title: string;
  @Input() request: any;
  @Input() route: any;
  @Input() background: any;
  @Input() totalRecords: any;
  @Input() arrowShow: any = null;
  @Output() view = new EventEmitter();
  @Output() viewIt = new EventEmitter();
  router = inject(Router);
  moment = moment;

  constructor() {
    addIcons({
      'chevron-forward-outline': chevronForwardOutline,
      'call-outline': callOutline,
      'mail-outline': mailOutline,
      'location-outline': locationOutline,
    });
  }

  viewAll() {
    this.view.emit();
  }

  viewDetails(serviceRequestId: string, memberId: any) {
    if (this.route) {
      this.router.navigate([this.route, serviceRequestId, memberId]);
    }
  }
}
