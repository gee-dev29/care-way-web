import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent, ToastService } from '@care-way/ui';
import {
  IonContent,
  IonIcon,
  IonImg,
  IonText,
} from '@ionic/angular/standalone';
import { Share } from '@capacitor/share';
import { AuthService, environment } from '@care-way/shared';
import { ApiService } from '@care-way/api';

@Component({
  selector: 'app-referral',
  imports: [IonContent, IonIcon, IonText, IonImg, ButtonComponent],
  templateUrl: './referral.html',
  styleUrl: './referral.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Referral implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private api = inject(ApiService);
  refLink: any;
  successModal = false;
  loading: boolean;

  ngOnInit() {
    this.auth.userDetail(this.api, (auth) => {
      const userId = auth?.userTypeId;
      if (userId) {
        this.api.getUser({ userId: userId }).subscribe((res: any) => {
          const referralCode = res?.userCode;
          this.refLink = environment.appUrl + '/signup/' + referralCode;
        });
      }
    });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/profile');
  }

  viewHistory() {
    this.router.navigateByUrl('/dashboard/referral-history');
  }
  copyLink() {
    navigator.clipboard.writeText(this.refLink);
    this.toast.show('Link copied successfully', 'success');
  }

  async shareLink() {
    this.loading = true;
    await Share.share({
      title: 'Check this out!',
      text: 'A friend on Care-Way app wants you to also enjoy an unlimited health facilities:',
      url: this.refLink,
      dialogTitle: 'Share via',
    }).then(() => (this.loading = false));
  }

  openModal() {
    this.successModal = true;
  }
}
