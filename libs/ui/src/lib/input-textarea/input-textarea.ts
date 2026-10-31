import { Component, CUSTOM_ELEMENTS_SCHEMA, forwardRef } from '@angular/core';
import { IonItem, IonLabel, IonTextarea } from '@ionic/angular/standalone';
import { FormControllerComponent } from '../FormController/form-controller.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-input-textarea',
  imports: [IonTextarea, IonItem, IonLabel],
  templateUrl: './input-textarea.html',
  styleUrl: './input-textarea.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextarea),
      multi: true,
    },
  ],
})
export class InputTextarea extends FormControllerComponent {

}
