import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import {
  AuthService,
  ProfileInfoService,
  ToastService,
} from '@care-way/shared';
import { Biometric, ConfirmationModal } from '@care-way/ui';
import { IonIcon, IonImg, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronForwardOutline,
  notificationsOutline,
  giftOutline,
  calendarOutline,
} from 'ionicons/icons';
import { forkJoin, map, Observable } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-doctor-profile-page',
  imports: [IonIcon, IonImg, CommonModule, IonAvatar, ConfirmationModal],
  templateUrl: './doctor-profile-page.html',
  styleUrl: './doctor-profile-page.css',
})
export class DoctorProfilePage implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  public profileInfoService: any = inject(ProfileInfoService);
  user: any;
  picture$: Observable<any>;
  professionalId: string;
  biometricService = inject(Biometric);
  showBiometric = false;
  canUseBiometric = false;
  prompt = false;

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
    this.activatedRoute.params.subscribe((params) => {
      this.professionalId = params['professionalId'];
    });
  }

  async loadProfile() {
    this.canUseBiometric = await this.biometricService.isSupported();
    this.showBiometric = await this.biometricService.hasBiometricCredentials(
      'doctor'
    );
    this.auth.userDetail(this.api, (auth) => {
      this.profileInfoService.name = auth?.name as string;

      const userId = auth?.userTypeId as any;
      this.getProfilePicture(userId).subscribe((url: any) => {
        this.profileInfoService.picture = url;
      });
    });
  }

  getProfilePicture(referencedDocumentId: string) {
    return this.api.getUploads({ referencedDocumentId }).pipe(
      map((response: any[]) => {
        return response?.length ? response[response.length - 1].url : null;
      })
    );
  }
  goTo(path: string) {
    this.router.navigateByUrl(
      `/doctor-dashboard/${this.professionalId}/${path}`
    );
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
    this.router.navigateByUrl('dashboard/upload-profile-picture');
  }
  async biometricFunction(name: string) {
    if (name === 'Enable Biometric') {
      try {
        await this.biometricService.authenticate();
        const password = v4();
        this.auth.userDetail(this.api, (auth: any) => {
          const referencedDocumentId = auth?.jti;
          forkJoin({
            user: this.api.getUser({
              userId: referencedDocumentId,
            }),
            setPassword: this.api.setBiometricPassword({
              body: { password: password },
            }),
          }).subscribe(async ({ user }) => {
            const response: any = user;
            await this.biometricService.enableBiometric(
              response.email,
              password,
              'doctor'
            );
            this.toast.show('Biometric enabled!', 'success');
            this.loadProfile()
          });
        });
      } catch (error: any) {
        this.toast.show(
          error?.message || 'Unable to enable biometric authentication.',
          'error'
        );
      }
    } else if (name === 'Disable Biometric') {
      this.prompt = true;
    }
  }
  closeConfirmationModal() {
    this.prompt = false;
  }
  async disable() {
    try {
      await this.biometricService.authenticate();
      this.biometricService.disableBiometric('doctor');
      this.toast.show('Biometric disabled!', 'success');
      this.loadProfile()
      setTimeout(() => {
        this.prompt = false;
      }, 1000);
    } catch (error: any) {
      this.toast.show(
        error?.message || 'Unable to disable biometric authentication.',
        'error'
      );
    }
  }
}
