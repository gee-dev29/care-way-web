import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { IonAvatar, IonSkeletonText } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { CardIdentityType } from '../models/action.model';
import { PlusIconComponent } from '../plus-icon-component/plus-icon-component';

@Component({
  selector: 'ui-dashboard-identities-list-card',
  imports: [CommonModule, IonAvatar, IonSkeletonText, PlusIconComponent],
  templateUrl: './dashboard-identities-list-card.html',
  styleUrl: './dashboard-identities-list-card.css',
})
export class DashboardIdentitiesListCard {
  @Input() identities$: Observable<any>;
  identities = input<any[]>();
  identitiesTotalRecords = input<number>();
  cardHeading = input<string>();
  viewAllRoute = input<string>();
  identityType = input<string>();
  @Output() addIdentity = new EventEmitter<Event>();
  @Output() viewAll = new EventEmitter<Event>();
  type = CardIdentityType;
}
