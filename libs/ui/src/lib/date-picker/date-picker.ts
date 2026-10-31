import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonDatetime } from '@ionic/angular/standalone';
import moment from 'moment';

@Component({
  selector: 'ui-date-picker',
  imports: [IonDatetime, ReactiveFormsModule, CommonModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DatePicker implements OnInit {
  @Input() control!: FormControl;
  today: any;
  tenYearsBefore: any;
  @Input() byPassDate: any;
  @Input() isGeneric: boolean;
  @Input() min: any;
  @Input() max: any;

  ngOnInit(): void {
    this.today = moment().format('YYYY-MM-DD');
    if (this.byPassDate) {
      this.tenYearsBefore = moment().add(10, 'years').format('YYYY-MM-DD');
    } else {
      this.tenYearsBefore = moment().subtract(10, 'years').format('YYYY-MM-DD');
    }
  }

  onDateTimeChange(value: string | string[] | null | undefined) {
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
