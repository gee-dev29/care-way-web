import { Component, inject } from '@angular/core';
import {
  ConversionService,
  SetCountry,
  ToastService,
} from '@healbridge/shared';
import { ApiService, Gender, NonProfessionalUserType } from '@healbridge/api';
import { SharedSignup } from '@healbridge/ui';

@Component({
  selector: 'agency-sign-up',
  imports: [SharedSignup],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  toast = inject(ToastService);
  conversionService = inject(ConversionService);
  countryService = inject(SetCountry);
  api = inject(ApiService);
  nonProfessionalUserType = NonProfessionalUserType.Agent;
  gender = Gender;
}
