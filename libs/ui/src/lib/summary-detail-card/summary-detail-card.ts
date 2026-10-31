import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Output,
} from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { InputTextarea } from '../input-textarea/input-textarea';

@Component({
  selector: 'ui-summary-detail-card',
  imports: [IonIcon, CommonModule, InputTextarea],
  templateUrl: './summary-detail-card.html',
  styleUrl: './summary-detail-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SummaryDetailCard {
  @Output() back = new EventEmitter<void>();

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  goBack() {
    this.back.emit();
  }
}
