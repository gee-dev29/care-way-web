import { Component } from '@angular/core';
import { SharedProfile } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-radiology-profile',
  imports: [IonContent, SharedProfile],
  templateUrl: './radiology-profile.html',
  styleUrl: './radiology-profile.css',
})
export class RadiologyProfile {

}
