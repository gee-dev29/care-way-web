import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import {
  AuthService,
  ToastService,
  ProfileInfoService,
} from '@care-way/shared';
import { IonIcon, IonImg, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronForwardOutline,
  notificationsOutline,
  giftOutline,
  calendarOutline,
} from 'ionicons/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'rider-more-rider',
  imports: [IonIcon, IonImg, CommonModule, IonAvatar],
  templateUrl: './more-rider.html',
  styleUrl: './more-rider.css',
})
export class MoreRider implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  public profileInfoService: any = inject(ProfileInfoService);
  user: any;
  picture$: Observable<any>;
  riderId: string;

  constructor() {
    addIcons({
      chevronForwardOutline,
      notificationsOutline,
      giftOutline,
      calendarOutline,
    });
  }

  ionViewWillEnter() {
    this.loadProfile();
  }

  ngOnInit(): void {
    this.riderId = this.auth.getUserId() as any;
  }

  loadProfile() {
    this.auth.userDetail(this.api, (auth) => {
      this.profileInfoService.name = auth?.name as string;
      this.api
        .getMembers({
          referencedDocumentId: auth?.jti,
        })
        .subscribe((response: any) => {
          this.profileInfoService.picture = response.data[0].profilePicture;
        });
    });
  }

  goTo(path: string) {
    this.router.navigate(['/dashboard', path, this.riderId]);
  }
  logout() {
    this.auth.userDetail(this.api, (auth) => {
      const sessionId = auth?.sessionId as any;
      this.api.destroySession({ sessionId: sessionId }).subscribe(() => {
        this.toast.show('Logged out successfully', 'success');
        this.auth.logout();
      });
    });
  }

  upload() {
    this.router.navigate(['dashboard/upload-profile-picture', this.riderId]);
  }
}
