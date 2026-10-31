import { Component, inject } from '@angular/core';
import { ApiService } from '@healbridge/api';
import { SharedForgotPassword } from '@healbridge/ui';
@Component({
  selector: 'app-forgot-password',
  imports: [SharedForgotPassword],

  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  public api = inject(ApiService);
}
