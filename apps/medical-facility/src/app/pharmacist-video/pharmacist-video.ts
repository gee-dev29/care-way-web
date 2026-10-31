import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PreviewVideo } from '@care-way/ui';

@Component({
  selector: 'medical-facility-pharmacist-video',
  imports: [PreviewVideo],
  templateUrl: './pharmacist-video.html',
  styleUrl: './pharmacist-video.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PharmacistVideo {}
