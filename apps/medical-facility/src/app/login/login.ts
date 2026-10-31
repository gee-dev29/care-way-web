import { Component, inject } from '@angular/core';
import { ApiService } from '@care-way/api';
import { AuthService, environment, FacilityTypeService, SetCountry } from '@care-way/shared';
import { SharedLogin } from '@care-way/ui';
@Component({
  selector: 'medical-facility-login',
  imports: [SharedLogin],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public environment = environment;
  public api = inject(ApiService);
  public auth = inject(AuthService);
  public FacilityTypeService = inject(FacilityTypeService);
  public setCountry = inject(SetCountry);
}
