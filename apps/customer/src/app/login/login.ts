import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService, environment, SetCountry } from '@care-way/shared';
import { SharedLogin } from '@care-way/ui';

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
