import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControllerComponent } from '../FormController/form-controller.component';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'ui-date-input',
  standalone: true,
  imports: [
    CommonModule,
    DatePicker,
    FormsModule, 
    ReactiveFormsModule,
    FloatLabel,
  ],
  templateUrl: './date-input.html',
  styleUrls: ['./date-input.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInput),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInput extends FormControllerComponent {
  @Output() calendar = new EventEmitter();
  @Input() patchDate: Date;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() showSeconds: boolean;
  @Input() hourFormat: string;
  @Input() stepHour: number;
  @Input() stepMinute: number;
  @Input() view: any = 'date';
  @Input() format = 'yy-mm-dd';
}
