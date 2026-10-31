import { Component, inject } from '@angular/core';
import { ApiService, NonProfessionalUserType } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { SharedVerifyOtp } from '@healbridge/ui';

@Component({
  selector: 'app-verify-otp',
  imports: [SharedVerifyOtp],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css',
})
export class VerifyOtp {
  public api = inject(ApiService);
  public auth = inject(AuthService);
  NonProfessionalUserType = NonProfessionalUserType;
}
