import { Component, OnInit } from '@angular/core';
import { IonButton, IonCard, IonContent, IonIcon, IonImg, IonSkeletonText, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile-summary',
  imports: [IonContent, IonImg,IonIcon, IonCard,IonText, IonButton,IonSkeletonText],
  templateUrl: './profile-summary.html',
  styleUrl: './profile-summary.css',
})
export class ProfileSummary implements OnInit {
  loaded= false

  ngOnInit() {
  setTimeout(() => {
    this.loaded = true;
  }, 3000);
}

}
