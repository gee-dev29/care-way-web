import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { ApiService } from '@care-way/api';
import { AuthService, environment } from '@care-way/shared';
import { ButtonComponent, ToastService } from '@care-way/ui';
import { IonContent, IonIcon, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'agency-referral',
  imports: [IonContent, IonIcon, IonImg, ButtonComponent],
  templateUrl: './referral.html',
  styleUrl: './referral.css',
})
export class Referral {
  private router = inject(Router);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private api = inject(ApiService);
  refLink: string;
  successModal = false;
  medRefLink: string;
  loading: boolean;

  ngOnInit() {
    this.auth.userDetail(this.api, (auth) => {
      const userId = auth?.userTypeId;
      if (userId) {
        this.api.getUser({ userId: userId }).subscribe((res: any) => {
          const referralCode = res?.userCode;
          this.refLink = environment.appUrl + '/signup/' + referralCode;
          this.medRefLink = environment.MedAppUrl + '/signup/' + referralCode;
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
  copyLink(text: string) {
    navigator.clipboard.writeText(text);
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
