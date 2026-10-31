import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, VitalSignType } from '@care-way/api';
import { ButtonComponent, SafePipe, StorageService } from '@care-way/ui';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonModal,
  IonSkeletonText,
  IonText,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  closeCircle,
  imageOutline,
  shareOutline,
  timeOutline,
} from 'ionicons/icons';
import moment from 'moment';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-symptoms-details',
  imports: [
    IonContent,
    IonHeader,
    IonIcon,
    IonText,
    ButtonComponent,
    CommonModule,
    IonSkeletonText,
    IonImg,
    IonModal,
    IonCard,
    IonCardContent,
    SafePipe,
  ],
  templateUrl: './symptoms-details.html',
  styleUrl: './symptoms-details.css',
})
export class SymptomsDetails implements OnInit {
  private router = inject(Router);
  private storageService = inject(StorageService);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  viewCostAttachment = false;
  @ViewChild('modal') modal: IonModal;
  canDismiss = true;
  imageView: string;
  module: string | null = null;
  bodyId: string;
  memberId: string | null = null;
  imageData: any;
  loading = false;
  datalength = 0;
  symtomsDetails$: Observable<any>;
  viewUploadImage = false;

  constructor() {
    addIcons({
      shareOutline,
      calendarOutline,
      timeOutline,
      imageOutline,
      closeCircle,
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
      this.bodyId = params.bodyId;
    });
    this.storageService.user$.subscribe((user) => {
      this.memberId = user;
      if (this.memberId) {
        this.getMemberVitalSignHistory(this.memberId);
      }
    });

    if (this.bodyId) {
      this.uploadedSymptoms();
    }
  }

  uploadedSymptoms() {
    this.api
      .getUploads({
        referencedDocumentId: this.bodyId,
      })
      .subscribe((res) => {
        this.datalength = res.length;
        this.imageData = res;
      });
  }

  getMemberVitalSignHistory(memberId: string) {
    this.symtomsDetails$ = this.api
      .getMemberVitalSignHistory({
        memberId,
        vitalSign: VitalSignType.Symptom,
      })
      .pipe(
        map((records: any[]) => {
          const data = records.filter(
            (item) => item.vitalRecordId === this.bodyId
          );

          return data[0];
        })
      );
  }

  formatDateorTime(dateStr: string) {
    if (!dateStr) return '';

    if (dateStr.includes('-')) {
      return moment(dateStr, 'YYYY-MM-DD').format('MMM D, YYYY');
    }
    return moment(dateStr, 'HH:mm').format('h:mm');
  }

  showUploadedImage(url: any) {
    this.imageView = url;
    this.viewCostAttachment = true;
  }

  goBack() {
    this.router.navigateByUrl(`/dashboard/vitals/symptoms/${this.module}`);
  }

  continue() {
    this.router.navigateByUrl(`dashboard/schedule-appointment/${this.bodyId}`);
  }

  async closeSave() {
    this.viewCostAttachment = false;
    this.canDismiss = true;
    await this.modal.dismiss(null, 'close');
    this.canDismiss = false;
  }
}
