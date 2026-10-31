import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AppointmentType } from '../models/action.model';

@Component({
  selector: 'ui-card-type',
  imports: [CommonModule],
  templateUrl: './card-type.html',
  styleUrl: './card-type.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CardType {
  selectedId: string | null = null;
  @Input() heading: string;
  @Output() cardType = new EventEmitter();

  cardTypes = [
    {
      key: AppointmentType.Physical,
      value: AppointmentType.Physical,
    },
    {
      key: AppointmentType.Virtual,
      value: AppointmentType.Virtual,
    },
  ];

  onSelect(item: any) {
    this.selectedId = item.value;
    this.cardType.emit(item);
  }
}
