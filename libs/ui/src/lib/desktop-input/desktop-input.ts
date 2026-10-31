import { Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FormControllerComponent } from '../FormController/form-controller.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'ui-desktop-input',
  imports: [
    CommonModule,
    InputTextModule,
    PasswordModule,
    InputNumberModule,
    ReactiveFormsModule,
    MultiSelectModule,
    CheckboxModule,
    FloatLabelModule,
    FloatLabel,
  ],
  templateUrl: './desktop-input.html',
  styleUrl: './desktop-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DesktopInput),
      multi: true,
    },
  ],
})
export class DesktopInput extends FormControllerComponent {}
