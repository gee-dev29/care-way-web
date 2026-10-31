import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'back-office-hmo-details-card',
  imports: [CommonModule],
  templateUrl: './hmo-details-card.html',
  styleUrl: './hmo-details-card.css',
})
export class HmoDetailsCard {
  @Input() hmoDetails$: Observable<any>;
  @Output() editHmoDetails = new EventEmitter<any>();
}
