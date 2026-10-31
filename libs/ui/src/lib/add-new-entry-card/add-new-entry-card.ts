import { Component, Input } from '@angular/core';
import { PlusIconComponent } from '../plus-icon-component/plus-icon-component';
import { IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-add-new-entry-card',
  imports: [PlusIconComponent, IonSkeletonText, IonIcon, CommonModule],
  templateUrl: './add-new-entry-card.html',
  styleUrl: './add-new-entry-card.css',
})
export class AddNewEntryCard {
  @Input() heading: any;
  @Input() title: any;
  @Input() state: 'add' | 'empty' | 'upload' = 'add';
  isLoading = true;

  constructor() {
    setTimeout(() => {
      this.isLoading = false;
    }, 100);
  }
}
