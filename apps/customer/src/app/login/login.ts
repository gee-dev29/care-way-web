import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService, environment, SetCountry } from '@healbridge/shared';
import { SharedLogin } from '@healbridge/ui';

@Component({
  selector: 'app-login',
  imports: [SharedLogin],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public environment = environment;
  public router = inject(Router);
  public api = inject(ApiService);
  public auth = inject(AuthService);
  public setCountry = inject(SetCountry);

}
