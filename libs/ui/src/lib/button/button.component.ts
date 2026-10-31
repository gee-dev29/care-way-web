import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonIcon,
  IonImg,
  IonSpinner,
} from '@ionic/angular/standalone';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonImg, IonSpinner],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() backgroundColor = '';
  @Input() borderLine = '';
  @Input() textColor = '';
  @Input() size: 'smallest' | 'small' | 'medium' | 'large' | 'full' = 'medium';
  @Input() width: 'fit' | 'full' = 'fit';
  @Input() icon = '';
  @Input() label = '';
  @Input() fill = '';
  @Input() shape = '';
  @Input() slot = '';
  @Input() image = '';
  @Input() showImage = false;
  @Input() showIcon = false;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() style = '';
  @Output() Click = new EventEmitter();
}
