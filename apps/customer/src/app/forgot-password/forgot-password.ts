import { Component, inject } from '@angular/core';
import { ApiService } from '@care-way/api';
import { SharedForgotPassword } from '@care-way/ui';
@Component({
  selector: 'app-forgot-password',
  imports: [SharedForgotPassword],

  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  public api = inject(ApiService);
}
