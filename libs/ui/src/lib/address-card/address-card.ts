import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-address-card',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './address-card.html',
  styleUrl: './address-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddressCard {
  @Input() address$: Observable<any>;
  @Output() selectItem$: Observable<any>;
  @Output() selectAddress = new EventEmitter();
  selectedId: number | null = null;

  onSelect(item: any) {
    this.selectedId = item.addressId;
    this.selectAddress.emit(item);
  }
}
