import { Component, inject } from '@angular/core';
import { ApiService } from '@care-way/api';
import { AuthService, environment, SetCountry } from '@care-way/shared';
import { SharedLogin } from '@care-way/ui';
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
