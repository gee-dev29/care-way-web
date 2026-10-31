import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import {
  AuthService,
  ProfileInfoService,
  ToastService,
} from '@healbridge/shared';
import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonImg,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  chevronBackOutline,
  chevronForwardOutline,
  giftOutline,
  notificationsOutline,
} from 'ionicons/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'agency-profile',
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
  agentId: string;

  constructor() {
    addIcons({
      chevronForwardOutline,
      notificationsOutline,
      giftOutline,
      calendarOutline,
      chevronBackOutline,
    });
  }

  ionViewWillEnter() {
    this.loadProfile();
  }

  ngOnInit(): void {
    this.agentId = this.auth.getUserId() as any;
  }

  loadProfile() {
    this.auth.userDetail(this.api, (auth) => {
      this.profileInfoService.name = auth?.name as string;
      this.api
        .getMembers({
          referencedDocumentId: auth?.jti,
        })
        .subscribe((response: any) => {
          if (response.data[0]?.profilePicture) {
            this.profileInfoService.picture = response.data[0].profilePicture;
          }
        });
    });
  }

  goTo(path: string) {
    this.router.navigate(['/dashboard', path]);
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
    this.router.navigate(['dashboard/upload-profile-picture', this.agentId]);
  }
  back() {
    this.router.navigateByUrl('/dashboard/more');
  }
}
