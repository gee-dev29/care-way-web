import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { AddPostPrandial } from '@healbridge/ui';
import { ApiService, VitalSignType } from '@healbridge/api';
import { TestingType } from '@healbridge/shared';

@Component({
  selector: 'app-add-post-prandial-vitals',
  imports: [IonContent, AddPostPrandial],
  templateUrl: './add-post-prandial-vitals.html',
  styleUrl: './add-post-prandial-vitals.css',
})
export class AddPostPrandialVitals {
  public api = inject(ApiService);
  vitalSignType = VitalSignType;
  testingType = TestingType;
}
