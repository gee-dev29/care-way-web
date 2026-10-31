import { Component, inject } from '@angular/core';
import { ApiService } from '@healbridge/api';
import { AuthService, environment, SetCountry } from '@healbridge/shared';
import { SharedLogin } from '@healbridge/ui';
@Component({
  selector: 'agency-login',
  imports: [SharedLogin],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public environment = environment;
  public api = inject(ApiService);
  public auth = inject(AuthService);
  public setCountry = inject(SetCountry);
}
