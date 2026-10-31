import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'ui-service-request-details-card',
  imports: [CommonModule],
  templateUrl: './service-request-details-card.html',
  styleUrl: './service-request-details-card.css',
})
export class ServiceRequestDetailsCard {
  @Input() serviceRequest$: Observable<any>;
  @Input() member$: Observable<any>;
   moment = moment;
}
