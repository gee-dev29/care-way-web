import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { ProfileInfoService, TestingType } from '@care-way/shared';
import { PostPrandial } from '@care-way/ui';

@Component({
  selector: 'app-post-prandial-vitals',
  imports: [PostPrandial],
  templateUrl: './post-prandial-vitals.html',
  styleUrl: './post-prandial-vitals.css',
})
export class PostPrandialVitals {
  public api = inject(ApiService);
  profileInfoService = inject(ProfileInfoService);
  vitalSignType = VitalSignType;
  TestingType = TestingType;
}
