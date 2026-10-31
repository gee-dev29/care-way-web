import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { TestingType } from '@care-way/shared';
import { AddPostPrandial } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-postprandial-vitals',
  imports: [IonContent, AddPostPrandial],
  templateUrl: './add-postprandial-vitals.html',
  styleUrl: './add-postprandial-vitals.css',
})
export class AddPostprandialVitals {
  public api = inject(ApiService);
  vitalSigntype = VitalSignType;
  testingType = TestingType;
}
