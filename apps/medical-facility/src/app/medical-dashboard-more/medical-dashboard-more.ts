import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import {
  AuthService,
  FacilityTypeService,
  ProfileInfoService,
  ToastService,
} from '@healbridge/shared';
import { Biometric, MoreMenuPage } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-medical-dashboard-more',
  imports: [MoreMenuPage, IonContent],
  templateUrl: './medical-dashboard-more.html',
  styleUrl: './medical-dashboard-more.css',
})
export class MedicalDashboardMore implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public api = inject(ApiService);
  public auth = inject(AuthService);
  public toast = inject(ToastService);
  public facilityTypeService = inject(FacilityTypeService);
  public profileInfoService = inject(ProfileInfoService);
  biometricService = inject(Biometric);
  showBiometric = false;
  canUseBiometric = false;
  bg: any;
  facilityId: string;
  categoryId: string;
  facilityType: string;
  FacilityType = FacilityType;
  link: string;
  moreMenu: any = [];

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.categoryId = params.categoryId;
      this.facilityId = params.facilityId;
      this.facilityType = params.facilityType;
    });
  }

  ionViewWillEnter() {
    if (this.facilityType && this.categoryId && this.facilityId) {
      switch (this.facilityType) {
        case FacilityType.Pharmacy:
          this.link = `/dashboard/pharm-profile/${this.facilityId}/${this.categoryId}`;
          this.reuse(this.facilityType);
          break;
        case FacilityType.Hospital:
          this.link = `/dashboard/hospital-profile/${this.facilityId}/${this.categoryId}`;
          this.reuse(this.facilityType);
          break;
        case FacilityType.BloodBank:
          this.link = `/dashboard/blood-bank-profile/${this.facilityId}/${this.categoryId}`;
          this.reuse(this.facilityType);
          break;
        case FacilityType.Radiology:
          this.link = `/dashboard/radiology-profile/${this.facilityId}/${this.categoryId}`;
          this.reuse(this.facilityType);
          break;
        case FacilityType.Laboratory:
          this.link = `/dashboard/laboratory-profile/${this.facilityId}/${this.categoryId}`;
          this.reuse(this.facilityType);
          break;
        default:
          break;
      }
    }
    this.reload();
  }

  back() {
    this.router.navigate(['dashboard', 'home']);
  }

  reuse(facilityType: any) {
    switch (facilityType) {
      case this.FacilityType.BloodBank:
        this.bg = '#FFFFFF';
        break;
      case this.FacilityType.Radiology:
        this.bg = '#FFFFFF';
        break;
      case this.FacilityType.Laboratory:
        this.bg = '#FFFFFF';
        break;
      case this.FacilityType.Pharmacy:
        this.bg = '#F9F8F6';
        break;
    }
  }

  async reload() {
    this.canUseBiometric = await this.biometricService.isSupported();
    this.showBiometric = await this.biometricService.hasBiometricCredentials(
      'facility'
    );
    this.moreMenu = [
      {
        name: 'Profile',
        link: this.link,
        icon: '/logo/profile-icon.svg',
      },
    ];
    if (this.facilityType === FacilityType.Hospital) {
      this.moreMenu.push({
        name: 'Appointments',
        link: `dashboard/list-all-medical-facility-appointments/${this.facilityType}/${this.facilityId}/${this.categoryId}`,
        icon: '/logo/appointments.svg',
      });
      this.moreMenu.push({
        name: 'Invitations',
        link: `dashboard/more/${this.facilityType}/${this.facilityId}/${this.categoryId}/list-all-invites`,
        icon: '/logo/invitations.svg',
      });
      this.moreMenu.push({
        name: 'Medical Services',
        link: `dashboard/more/${this.facilityType}/${this.facilityId}/${this.categoryId}/view-all-medical-service`,
        icon: '/icons/medicalService.svg',
      });
    }
    if (this.canUseBiometric) {
      this.moreMenu.push({
        name: this.showBiometric ? 'Disable Biometric' : 'Enable Biometric',
        icon: '/logo/biometric.svg',
      });
    }
    this.moreMenu.push({
      name: 'Log out',
      icon: '/logo/help-icon.svg',
    });
  }
}
