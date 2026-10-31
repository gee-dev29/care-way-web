import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  IonDatetime,
  IonDatetimeButton,
  IonModal,
} from '@ionic/angular/standalone';

@Component({
  selector: 'ui-datetime-picker',
  imports: [IonDatetimeButton, IonDatetime, IonModal, ReactiveFormsModule],
  templateUrl: './datetime-picker.html',
  styleUrl: './datetime-picker.css',
})
export class DatetimePicker {
  @Input() control!: FormControl;

  onDateTimeChange(value: string | string[] | null | undefined) {
    if (this.control) {
      if (typeof value === 'string') {
        this.control.setValue(value);
      } else {
        this.control.setValue('');
      }
    }
  }
}
