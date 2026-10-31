import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormControllerComponent } from '../FormController/form-controller.component';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ui-input-drop-down',
  imports: [CommonModule, SelectModule, ReactiveFormsModule, FormsModule],
  templateUrl: './input-drop-down.component.html',
  styleUrls: ['./input-drop-down.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDropDownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDropDownComponent extends FormControllerComponent {}
export interface Dropdown {
  key: string;
  value: string;
}
