import { Component, inject } from '@angular/core';
import { ApiService, NonProfessionalUserType } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { SharedSetPassword } from '@healbridge/ui';

@Component({
  selector: 'app-set-password',
  imports: [SharedSetPassword],
  templateUrl: './set-password.html',
  styleUrl: './set-password.css',
})
export class SetPassword {
  public api = inject(ApiService);
  public auth = inject(AuthService);
  NonProfessionalUserType = NonProfessionalUserType;
}
