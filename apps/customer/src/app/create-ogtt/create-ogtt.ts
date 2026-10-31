import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { TestingType } from '@care-way/shared';
import { AddOgtt } from '@care-way/ui';
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
