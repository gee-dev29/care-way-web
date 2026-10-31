import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService, NonProfessionalUserType } from '@healbridge/api';
import { ValidateOtp } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-med-validate-otp',
  imports: [ValidateOtp, IonContent],
  templateUrl: './med-validate-otp.html',
  styleUrl: './med-validate-otp.css',
})
export class MedValidateOtp {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public api = inject(ApiService);
  amount: number;
  facilityType: string;
  withdrawalId: string;
  facilityId: string;
  moduleType = NonProfessionalUserType.MedicalFacility;

  ionViewWillEnter() {
    this.route.params.subscribe((param: Params) => {
      this.withdrawalId = param['withdrawalId'];
      this.facilityType = param['facilityType'];
      this.facilityId = param['facilityId'];
    });
    this.amount = history.state?.amount;
  }

  routeTo() {
    this.router.navigate(['dashboard/wallet-withdrawal'], {
      queryParams: {
        facilityType: this.facilityType,
        facilityId: this.facilityId,
      },
    });
  }
}
