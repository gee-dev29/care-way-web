import { Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FormControllerComponent } from '../FormController/form-controller.component';

@Component({
  selector: 'ui-input-radio',
  standalone: true,
  imports: [CommonModule, RadioButtonModule, ReactiveFormsModule],
  templateUrl: './input-radio.component.html',
  styleUrl: './input-radio.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputRadioComponent),
      multi: true,
    },
  ],
})
export class InputRadioComponent extends FormControllerComponent {}
