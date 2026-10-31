/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { FormControllerComponent } from '../FormController/form-controller.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  IonInput,
  IonInputOtp,
  IonInputPasswordToggle,
  IonItem,
  IonList,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonIcon,
  IonRadio,
  IonCheckbox,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Typeahead } from '../typeahead/typeahead';
import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';
@Component({
  selector: 'ui-input',
  imports: [
    RouterLink,
    IonItem,
    IonInput,
    IonInputPasswordToggle,
    CommonModule,
    IonToggle,
    IonInputOtp,
    IonRadio,
    IonList,
    IonSelect,
    IonSelectOption,
    Typeahead,
    IonIcon,
    IonModal,
    IonIcon,
    IonRadio,
    IonCheckbox,
  ],
  templateUrl: './input.html',
  styleUrl: './input.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent extends FormControllerComponent {
  constructor() {
    super();
    addIcons({ chevronDownOutline });
  }
  @Input() selectedText: any = '0 Items';
  canDismiss = false;
  @Input() isClicked = false;
  @Input() isItemObject = false;
  @Input() border = false;
  @Input() color = 'primary';
  @Input() line = true;
  @Input() bypass = false;
  @Input() emptyGroupMessage = 'There are no items here!';
  @Input() requiredGroups: string[] = [];
  @Output() emitted = new EventEmitter();
  @Output() focused = new EventEmitter<void>();
  @Output() blurred = new EventEmitter<void>();
  @Output() onIonChange = new EventEmitter();

  optionSelectionChanged(event: any) {
    this.selectedItem = event;
    this.selectedText = this.formatData(this.selectedItem);
    this.writeValue(this.selectedItem);
    this.canDismiss = true;
  }
  cancel() {
    this.canDismiss = true;
  }
  handleInput(event: any) {
    const value = event.detail.value;
    this.onIonChange.emit(value);
  }

  private formatData(data: any): string {
    if (this.isMultiselect) {
      if (data.length === 1) {
        const fruit = this.options.find((item: any) => item.value === data[0]);
        return fruit ? fruit.value : '';
      }
      return `${data.length} items`;
    } else {
      return data;
    }
  }
}
