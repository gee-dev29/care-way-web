import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-license-details-card',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './license-details-card.html',
  styleUrl: './license-details-card.css',
})
export class LicenseDetailsCard {
  @Input() facilityType: any;
  @Input() license$: Observable<any>;
  @Input() hospitalId: string;
}
