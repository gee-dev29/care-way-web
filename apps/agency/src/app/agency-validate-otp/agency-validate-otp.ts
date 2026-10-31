import { Component, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, NonProfessionalUserType } from '@care-way/api';
import { ValidateOtp } from '@care-way/ui';

@Component({
  selector: 'agency-agency-validate-otp',
  imports: [ValidateOtp],
  templateUrl: './agency-validate-otp.html',
  styleUrl: './agency-validate-otp.css',
})
export class AgencyValidateOtp {
  private router = inject(Router);
  public api = inject(ApiService);
  public route = inject(ActivatedRoute);

  amount: number;
  withdrawalId: string;
  moduleType = NonProfessionalUserType.Agent;

  constructor() {
    this.route.params.subscribe((param: Params) => {
      this.withdrawalId = param['withdrawalId'];
    });
    this.amount = history.state?.amount;
  }

  routeTo() {
    this.router.navigate(['dashboard/wallet-withdraw']);
  }
}
