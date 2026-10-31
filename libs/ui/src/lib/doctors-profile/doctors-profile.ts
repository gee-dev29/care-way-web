import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonIcon,
  IonImg,
  IonList,
  IonSkeletonText,
  IonText,
  IonAvatar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'ui-doctors-profile',
  imports: [IonText, IonList, IonImg, IonIcon, IonSkeletonText, IonAvatar],
  templateUrl: './doctors-profile.html',
  styleUrl: './doctors-profile.css',
})
export class DoctorsProfile {
  constructor() {
    setTimeout(() => {
      this.loaded = true;
    }, 3000);
  }
  router = inject(Router);
  @Input() title: string;
  @Input() label1 = '';
  @Input() viewAllColor = '#007bff';
  @Input() label2 = '';
  @Input() addRecord: string;
  @Output() view = new EventEmitter<any>();
  @Output() routeTo = new EventEmitter<any>();
  @Input() doctorsList: any;
  loaded = false;

  onAddRecord() {
    this.router.navigateByUrl(this.addRecord);
  }
}
