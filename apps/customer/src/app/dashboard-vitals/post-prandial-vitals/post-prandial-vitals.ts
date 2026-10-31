import { Component, inject } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { ProfileInfoService, TestingType } from '@healbridge/shared';
import { PostPrandial } from '@healbridge/ui';

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
