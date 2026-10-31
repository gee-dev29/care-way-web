import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import moment from 'moment';

@Component({
  selector: 'ui-medical-request-card',
  imports: [IonIcon, IonSkeletonText],
  templateUrl: './medical-request-card.html',
  styleUrl: './medical-request-card.css',
})
export class MedicalRequestCard {
  @Input() title: string;
  @Input() request: any;
  @Input() route: any;
  @Input() background: any;
  @Input() arrowShow: any = null;
  @Output() view = new EventEmitter();
  @Output() viewIt = new EventEmitter();

  moment = moment;
  constructor() {
    addIcons({
      'chevron-forward-outline': chevronForwardOutline,
    });
  }
  private router = inject(Router);

  viewAll() {
    this.view.emit();
  }

  viewDetails(serviceRequestId: string, memberId: any) {
    if (this.route) {
      this.router.navigate([this.route, serviceRequestId, memberId]);
    }
  }
}
