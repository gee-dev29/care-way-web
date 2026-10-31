import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Relationship } from '@care-way/api';
import { AuthService, ProfileInfoService } from '@care-way/shared';
import { ToastService } from '@care-way/ui';
import {
  IonContent,
  IonIcon,
  IonImg,
  IonText,
  IonAvatar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  giftOutline,
  notificationsOutline,
} from 'ionicons/icons';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [IonContent, IonIcon, IonImg, IonText, CommonModule, IonAvatar],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private router = inject(Router);
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  public profileInfoService: any = inject(ProfileInfoService);
  user: any;
  picture$: Observable<any>;

  ionViewWillEnter() {
    this.loadProfile();
  }

  getProfilePicture(referencedDocumentId: string) {
    return this.api
      .getUploads({ referencedDocumentId })
      .pipe(map((res: any) => res?.at(-1)?.url ?? null));
  }

  loadProfile() {
    this.auth.userDetail(this.api, (auth: any) => {
      if (!auth) return;
      this.api
        .getMembers({ referencedDocumentId: auth.jti } as any)
        .pipe(
          map(
            (response: any) =>
              response.data.find(
                (member: any) => member.relationship === Relationship.Self
              ) ?? response.data[0]
          ),
          switchMap((member: any) =>
            this.getProfilePicture(member?.memberId).pipe(
              map((url) => ({ ...member, url }))
            )
          )
        )
        .subscribe((res: any) => {
          this.profileInfoService.loggedInName = `${res?.firstName ?? ''} ${
            res?.lastName ?? ''
          }`.trim();
          this.profileInfoService.loggedInEmail = res?.email;
          this.profileInfoService.loggedInPicture = res?.url;
        });
    });
  }

  constructor() {
    addIcons({
      chevronForwardOutline,
      notificationsOutline,
      giftOutline,
      chevronBackOutline,
    });
  }

  goTo(path: string) {
    this.router.navigateByUrl(`/dashboard/${path}`);
  }

  upload() {
    this.router.navigateByUrl('dashboard/upload-profile-picture');
  }
  back() {
    this.router.navigateByUrl('/dashboard/more');
  }
}
