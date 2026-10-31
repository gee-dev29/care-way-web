import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-license-details-card',
  imports: [CommonModule],
  templateUrl: './license-details-card.html',
  styleUrl: './license-details-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LicenseDetailsCard {
  @Input() license$: Observable<any>;
}
