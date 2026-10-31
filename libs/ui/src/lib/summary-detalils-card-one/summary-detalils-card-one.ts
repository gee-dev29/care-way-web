import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonCard, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'ui-summary-detalils-card-one',
  imports: [IonCard, IonIcon, IonText],
  templateUrl: './summary-detalils-card-one.html',
  styleUrl: './summary-detalils-card-one.css',
})
export class SummaryDetalilsCardOne {
  constructor() {
    addIcons({
      'eye-outline': eyeOutline,
    });
  }
  @Input() icon = '';
  @Input() title = '';
  @Input() isEdit = false;
  @Input() items: { label: string; value: string }[] = [];
  @Input() showLicenseEye = false;

  @Output() edit = new EventEmitter<void>();
  @Output() eyeClick = new EventEmitter<void>();


  eyeClicked() {
    this.eyeClick.emit();
  }
}
