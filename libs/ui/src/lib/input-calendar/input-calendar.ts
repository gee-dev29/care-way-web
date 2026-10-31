import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, forwardRef, Output } from '@angular/core';
import {
  IonDatetime,
  IonInput,
  IonItem,
  IonIcon,
  IonModal,
} from '@ionic/angular/standalone';
import { FormControllerComponent } from '../FormController/form-controller.component';
import { ButtonComponent } from '../button/button.component';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'ui-input-calendar',
  imports: [
    IonDatetime,
    IonInput,
    IonItem,
    IonIcon,
    IonModal,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './input-calendar.html',
  styleUrl: './input-calendar.css',
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCalendar),
      multi: true,
    },
  ],
})
export class InputCalendar extends FormControllerComponent {
  open = false;
  dater: any;
  canDismiss = false;
  @Output() emitDate = new EventEmitter();
  constructor() {
    super();
  }
  openCalendar() {
    const current = this.control?.value;
    this.dater =
      current && moment(current).isValid()
        ? moment(current).format('YYYY-MM-DD')
        : undefined;
    this.open = true;
  }
  setDate() {
    this.open = false;
    this.dater = moment(this.dater).format('YYYY-MM-DD');
    this.value = this.dater;
    this.control.setValue(this.dater);
    this.control.markAsDirty();
    this.emitDate.emit(this.dater);
    this.canDismiss = true;
  }

}
