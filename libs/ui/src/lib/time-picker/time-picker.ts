import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonDatetime } from '@ionic/angular/standalone';

@Component({
  selector: 'ui-time-picker',
  imports: [IonDatetime, ReactiveFormsModule, CommonModule],
  templateUrl: './time-picker.html',
  styleUrl: './time-picker.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TimePicker {
  @Input() control!: FormControl;

  onTimeChange(value: string | string[] | null | undefined) {
    if (this.control) {
      if (typeof value === 'string') {
        this.control.setValue(value);
      } else {
        this.control.setValue('');
      }
      this.control.markAsDirty();
      this.control.markAsTouched();
    }
  }
}
