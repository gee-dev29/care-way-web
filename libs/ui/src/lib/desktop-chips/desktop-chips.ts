import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { FormControllerComponent } from '../FormController/form-controller.component';

@Component({
  selector: 'ui-desktop-chips',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    FloatLabel,
    AutoComplete,
  ],
  templateUrl: './desktop-chips.html',
  styleUrl: './desktop-chips.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DesktopChips extends FormControllerComponent {
  onChipKeydown(event: KeyboardEvent) {
    if (event.key === ',' || event.key === 'Enter') {
      event.preventDefault();

      const input = event.target as HTMLInputElement;
      const value = input.value.trim();

      if (value) {
        this.control.setValue([...(this.control.value ?? []), value]);

        input.value = '';
      }
    }
  }
}
