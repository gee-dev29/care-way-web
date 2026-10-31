import { Component, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService, NonProfessionalUserType } from '@healbridge/api';
import { ValidateOtp } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-doctor-validate-otp',
  imports: [ValidateOtp, IonContent],
  templateUrl: './doctor-validate-otp.html',
  styleUrl: './doctor-validate-otp.css',
})
export class DoctorValidateOtp {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public api = inject(ApiService);
  amount: number;
  professionalId: string;
  withdrawalId: string;
  moduleType = NonProfessionalUserType.Default;

  ionViewWillEnter() {
    this.route.params.subscribe((param: Params) => {
      this.professionalId = param['professionalId'];
      this.withdrawalId = param['withdrawalId'];
    });
    this.amount = history.state?.amount;
  }

  routeTo() {
    this.router.navigate([
      'doctor-dashboard',
      this.professionalId,
      'wallet-withdrawal',
    ]);
  }
}
