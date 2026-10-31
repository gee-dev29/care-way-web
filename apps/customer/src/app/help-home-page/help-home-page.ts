import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { IonImg, IonText } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@healbridge/ui';
import { ApiService } from '@healbridge/api';

@Component({
  selector: 'app-help-home-page',
  imports: [
    IonImg,
    ButtonComponent,
    IonText,
    ReactiveFormsModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './help-home-page.html',
  styleUrl: './help-home-page.css',
})
export class HelpHomePage implements OnInit {
  private api = inject(ApiService);

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  loading = false;
  otpLoading = false;
  loginLabel = 'Yes, Continue';
  member: any;
  helpId: string;
  orderId: string;

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.helpId = params.helpId;
      localStorage.setItem('countryId', JSON.stringify(params.countryId));
      setTimeout(() => {
        this.api
          .getOrderPaymentHelpRequest({ helpId: params.helpId })
          .subscribe((response: any) => {
            this.orderId = response.orderId;
            this.api
              .getServiceRequestOrder({
                orderId: response.orderId,
              })
              .subscribe((response2: any) => {
                this.api
                  .getMember({ memberId: response2.memberId })
                  .subscribe((member: any) => {
                    this.member = member;
                  });
              });
          });
      }, 1000);
    });
  }

  proceed(path: string) {
    if (path == 'proceed') {
      this.router.navigate(['/help-page', this.helpId, this.orderId]);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
