import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, NonProfessionalUserType } from '@healbridge/api';
import { ValidateOtp } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'rider-rider-validate-otp',
  imports: [ValidateOtp, IonContent],
  templateUrl: './rider-validate-otp.html',
  styleUrl: './rider-validate-otp.css',
})
export class RiderValidateOtp implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public api = inject(ApiService);
  amount: number;
  withdrawalId: string;
  moduleType = NonProfessionalUserType.Rider;

  ngOnInit() {
    this.route.params.subscribe((param: Params) => {
      this.withdrawalId = param['withdrawalId'];
    });

    this.amount = history.state?.amount;
  }

  routeTo() {
    this.router.navigate(['dashboard/wallet-withdraw']);
  }
}
