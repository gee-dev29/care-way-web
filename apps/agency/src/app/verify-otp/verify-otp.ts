import { Component, inject } from '@angular/core';
import { ApiService, NonProfessionalUserType } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import { SharedVerifyOtp } from '@care-way/ui';

@Component({
  selector: 'agency-verify-otp',
  imports: [SharedVerifyOtp],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css',
})
export class VerifyOtp {
  public api = inject(ApiService);
  public auth = inject(AuthService);
  userType = NonProfessionalUserType;
}
