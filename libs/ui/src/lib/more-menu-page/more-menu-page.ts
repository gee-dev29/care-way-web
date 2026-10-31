import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { Item } from '../types';
import { Router } from '@angular/router';
import { StorageService } from '../storage-service';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { Biometric } from '../biometric';
import { v4 } from 'uuid';
import { forkJoin, switchMap } from 'rxjs';
import { Password } from 'primeng/password';
import { ConfirmationModal } from '../confirmation-modal/confirmation-modal';

@Component({
  selector: 'ui-more-menu-page',
  imports: [IonIcon, IonCard, IonCardContent, CommonModule, ConfirmationModal],
  templateUrl: './more-menu-page.html',
  styleUrl: './more-menu-page.css',
})
export class MoreMenuPage {
  @Input() api: any;
  @Input() auth: any;
  @Output() back = new EventEmitter();
  @Output() triggerBiometric = new EventEmitter();
  @Input() otherMenus: any = [];
  @Input() title: string;
  @Input() toast: any;
  prompt = false;
  @Input() appModule: any;
  appOwner: any;
  private router = inject(Router);
  storageService = inject(StorageService);
  biometricService = inject(Biometric);
  @Input() profileInfoService: any;
  @Input() facilityTypeService: any;
  selectedItem: any = [];
  options: Item[] = [
    { text: 'Daughter', value: 'Daughter' },
    { text: 'Son', value: 'Son' },
  ];

  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
    });
  }

  async continue(link: string, name: string) {
    // if (link) {
    //   this.router.navigate([link]);
    // }
    if (name === 'Log out') {
      this.auth.userDetail(this.api, (auth: any) => {
        switch (auth?.userType) {
          case 'Medical Facility':
          case 'Pharmacist':
          case 'Doctor':
          case 'Nurse':
          case 'Pharmacy Staff':
          case 'Blood Bank Staff':
          case 'Laboratory Staff':
          case 'Radiology Staff':
          case 'Agent':
            this.profileInfoService.name = '';
            this.profileInfoService.email = '';
            this.profileInfoService.picture = '';
            this.facilityTypeService?.clear();
            this.removeAuth(auth);
            break;
          case 'Default':
            this.profileInfoService.name = '';
            this.profileInfoService.email = '';
            this.profileInfoService.picture = '';
            this.storageService.clearUser();
            this.removeAuth(auth);
            break;
          default:
            break;
        }
      });
    } else if (name === 'Enable Biometric') {
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
              this.appModule
            );
            this.toast.show('Biometric enabled!', 'success');
            this.triggerBiometric.emit();
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
    } else {
      this.router.navigate([link]);
    }
  }

  removeAuth(auth: any) {
    const sessionId = auth?.sessionId as any;
    this.api.destroySession({ sessionId: sessionId }).subscribe(() => {
      this.toast.show('Logged out successfully', 'success');
      this.auth.logout();
    });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

  closeConfirmationModal() {
    this.prompt = false;
  }
  async disable() {
    try {
      await this.biometricService.authenticate();
      this.biometricService.disableBiometric(this.appModule);
      this.toast.show('Biometric disabled!', 'success');
      this.triggerBiometric.emit();
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
