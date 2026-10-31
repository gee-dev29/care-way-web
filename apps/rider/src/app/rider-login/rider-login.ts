import { Component, inject } from '@angular/core';
import { ApiService } from '@care-way/api';
import { environment, AuthService, SetCountry } from '@care-way/shared';
import { SharedLogin } from '@care-way/ui';

@Component({
  selector: 'rider-login',
  imports: [SharedLogin],
  templateUrl: './rider-login.html',
  styleUrl: './rider-login.css',
})
export class RiderLogin {
  public environment = environment;
  public api = inject(ApiService);
  public auth = inject(AuthService);
  public setCountry = inject(SetCountry);
}
