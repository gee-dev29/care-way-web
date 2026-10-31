import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-address-details-card',
  imports: [
    CommonModule,
  ],
  templateUrl: './address-details-card.html',
  styleUrl: './address-details-card.css',
})
export class AddressDetailsCard {
  @Input() facilityType: any;
  @Input() address$: Observable<any>;
}
