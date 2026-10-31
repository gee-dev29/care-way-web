import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { TestingType } from '@healbridge/shared';
import { AddOgtt } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-create-ogtt',
  imports: [IonContent, AddOgtt],
  templateUrl: './create-ogtt.html',
  styleUrl: './create-ogtt.css',
})
export class CreateOgtt {
  api = inject(ApiService);
  VitalSignType = VitalSignType;
  TestingType = TestingType;
}
