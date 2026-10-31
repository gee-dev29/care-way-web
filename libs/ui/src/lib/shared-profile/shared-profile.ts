import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonIcon,
  IonText,
  IonImg,
  IonSkeletonText,
  IonModal,
  IonCard,
  IonCardContent,
  IonAvatar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, eye } from 'ionicons/icons';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-shared-profile',
  imports: [
    IonIcon,
    IonText,
    IonImg,
    IonSkeletonText,
    CommonModule,
    IonModal,
    IonCard,
    IonCardContent,
    IonAvatar,
  ],
  templateUrl: './shared-profile.html',
  styleUrl: './shared-profile.css',
})
export class SharedProfile implements OnInit {
  router = inject(Router);
  loaded = false;
  @Input() heading: string;
  @Input() api: any;
  @Input() route: any;
  @Input() cardColor = '#d8dfff';
  @Input() border = 'none';
  @Input() addRoute: any;
  @Input() licenseRoute: any;
  @Input() professionalType: any;
  professional$: Observable<any>;
  profileInfoService: any = {};
  license$: Observable<any>;
  private activatedRoute = inject(ActivatedRoute);
  professionalId: string;
  @ViewChild('modal') modal: IonModal;
  loading$: Observable<boolean>;
  picture: any;
  facilityId: any;
  facilityType: any;
  displayFile = false;
  canDismiss = false;

  ionViewWillEnter() {
    this.loadProfile();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.professionalId = params.professionalId;
      this.facilityId = params.facilityId;
      this.facilityType = params.facilityType;
      this.professional$ = this.api.getMedicalProfessional({
        professionalId: this.professionalId,
        professionalType: this.professionalType,
      });
      this.license$ = this.api
        .getPracticeLicenses({
          referencedDocumentId: this.professionalId,
        })
        .pipe(map((response: any) => response[0]));
      this.profileInfoService.name = this.professionalType;
      this.api
        .getUploads({ referencedDocumentId: this.professionalId })
        .subscribe((response: any) => {
          response.forEach((element: any, index: any) => {
            if (
              index == response.length - 1 &&
              element.name == 'Upload Picture'
            ) {
              this.profileInfoService.picture = element.url;
            }
          });
        });
    });
  }
  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'eye-outline': eye,
    });
  }

  goBack() {
    switch (this.facilityType) {
      case 'Laboratory':
        this.router.navigateByUrl('dashboard/labstaffs');
        break;
      case 'Blood Bank':
        this.router.navigateByUrl('dashboard/bbstaff');
        break;
      case 'Pharmacy':
        this.router.navigateByUrl('dashboard/pharms');
        break;
      case 'Radiology':
        this.router.navigateByUrl('dashboard/radiologystaff');

        break;
    }

    // this.router.navigateByUrl(
    //   `/dashboard/all-${this.heading
    //     .toLowerCase()
    //     .trim()
    //     .replace(/\s+/g, '-')}/${this.facilityType}/${this.facilityId}`
    // );
  }
  sendVerification() {
    console.log('sending verification....');
  }

  eyeClicked(licenseId: string) {
    this.api
      .getUploads({ referencedDocumentId: licenseId })
      .subscribe((res: any) => {
        this.canDismiss = true;
        this.modal.dismiss(null, 'close');
        this.picture = res[0].url;
        this.canDismiss = false;
        this.displayFile = true;
      });
  }

  editDetails(what: string, licenseId: any) {
    if (what === 'detail') {
      this.router.navigate([
        this.addRoute,
        this.facilityType,
        this.facilityId,
        this.professionalId,
      ]);
    } else {
      this.router.navigate([
        this.licenseRoute,
        this.facilityType,
        this.facilityId,
        this.professionalId,
        licenseId,
      ]);
    }
  }

  async closeSave() {
    this.displayFile = false;
    this.canDismiss = true;
    await this.modal.dismiss(null, 'close');
    this.canDismiss = false;
  }

  upload() {
    this.router.navigateByUrl(this.route);
  }
}
