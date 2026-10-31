import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService, NurseActiveFacility, ProfileInfoService, ToastService } from '@care-way/shared';
import { Biometric, ConfirmationModal } from '@care-way/ui';
import { IonAvatar, IonIcon, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, chevronForwardOutline, notificationsOutline } from 'ionicons/icons';
import { forkJoin, map, Observable } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-nurse-profile',
  standalone: true,
  imports: [CommonModule, IonIcon, IonImg, IonAvatar, ConfirmationModal],
  templateUrl: './nurse-profile.html',
  styleUrl: './nurse-profile.css',
})
export class NurseProfile implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private nurseActiveFacility = inject(NurseActiveFacility);
  public profileInfoService: any = inject(ProfileInfoService);
  biometricService = inject(Biometric);
  user: any;
  picture$: Observable<any>;
  showBiometric = false;
  canUseBiometric = false;
  prompt = false;

  professionalId!: string;

  constructor() {
    addIcons({ chevronForwardOutline, notificationsOutline, calendarOutline });
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
      'nurse'
    );
    this.auth.userDetail(this.api, (auth) => {
      this.profileInfoService.name = auth?.name as string;
      const userId = auth?.userTypeId as any;
      this.getProfilePicture(userId).subscribe((url: any) => {
        this.profileInfoService.picture = url;
      });
    });
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
              'nurse'
            );
            this.toast.show('Biometric enabled!', 'success');
            this.loadProfile();
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
      this.biometricService.disableBiometric('nurse');
      this.toast.show('Biometric disabled!', 'success');
      this.loadProfile();
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

  getProfilePicture(referencedDocumentId: string) {
    return this.api.getUploads({ referencedDocumentId }).pipe(
      map((response: any[]) => {
        return response?.length ? response[response.length - 1].url : null;
      })
    );
  }

  goTo(path: string) {
    this.router.navigateByUrl(`/nurse-dashboard/${this.professionalId}/${path}`);
  }

  upload() {
    this.router.navigateByUrl('dashboard/upload-profile-picture');
  }

  logout() {
    this.auth.userDetail(this.api, (auth) => {
      const sessionId = auth?.sessionId as any;
      this.api.destroySession({ sessionId }).subscribe(() => {
        this.toast.show('Logged out successfully', 'success');
        this.nurseActiveFacility.clear();
        this.auth.logout();
      });
    });
  }
}
