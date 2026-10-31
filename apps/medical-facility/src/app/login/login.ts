import { Component, inject } from '@angular/core';
import { ApiService } from '@healbridge/api';
import { AuthService, environment, FacilityTypeService, SetCountry } from '@healbridge/shared';
import { SharedLogin } from '@healbridge/ui';
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
