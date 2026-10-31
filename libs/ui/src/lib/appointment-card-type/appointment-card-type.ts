import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCheckbox,
} from '@ionic/angular/standalone';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-appointment-card-type',
  imports: [CommonModule, IonCard, IonCardContent, IonCheckbox],
  templateUrl: './appointment-card-type.html',
  styleUrl: './appointment-card-type.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppointmentCardType {
  @Output() cardType = new EventEmitter();
  @Input() membershipCardTypes$: Observable<any>;
  @Input() selectedId: string | null = null;

  onSelect(item: any) {
    this.selectedId = item.cardId;
    this.cardType.emit(item);
  }
}
