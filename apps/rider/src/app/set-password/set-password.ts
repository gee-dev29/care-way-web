import { Component, inject } from '@angular/core';
import { ApiService, NonProfessionalUserType } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import { SharedSetPassword } from '@care-way/ui';

@Component({
  selector: 'rider-set-password',
  imports: [SharedSetPassword],
  templateUrl: './set-password.html',
  styleUrl: './set-password.css',
})
export class SetPassword {
  public api = inject(ApiService);
  public auth = inject(AuthService);
  NonProfessionalUserType = NonProfessionalUserType;
}
