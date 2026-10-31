import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonCard,
  IonContent,
  IonIcon,
  IonList,
  IonSkeletonText,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronUpOutline } from 'ionicons/icons';
import moment from 'moment';
import { map, Observable } from 'rxjs';
import { PostPrandialCard } from '../post-prandial-card/post-prandial-card';
import { StorageService } from '../storage-service';

@Component({
  selector: 'ui-post-prandial',
  imports: [
    IonList,
    IonContent,
    IonIcon,
    IonText,
    IonSkeletonText,
    CommonModule,
    IonCard,
  ],
  templateUrl: './post-prandial.html',
  styleUrl: './post-prandial.css',
})
export class PostPrandial implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private storageService = inject(StorageService);
  @Input() api: any;
  @Input() vitalSignType: any;
  @Input() TestingType: any;
  module: string | null;
  memberId: string;
  vitalRecordId: string;
  loaded = true;
  postPrandial$: Observable<any>;
  showCard = true;

  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      chevronUpOutline,
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
      this.storageService.user$.subscribe((user) => {
        this.memberId = user;
        this.getPostPrandialHistory(this.memberId);
      });
      if (params.vitalRecordId) {
        this.vitalRecordId = params.vitalRecordId;
      }
    });
  }

  getPostPrandialHistory(memberId: any) {
    this.postPrandial$ = this.api
      .getMemberVitalSignHistory({
        memberId: memberId,
        vitalSign: this.vitalSignType.Glucose,
      })
      .pipe(
        map((records: any[]) => {
          this.loaded = false;

          return records
            .filter((record) =>
              record.readings?.some(
                (r: any) => r.testingType === this.TestingType.PostPrandial
              )
            )
            .map((record) => ({
              ...record,
              expanded: true,
            }));
        })
      );
  }

  toggleGroup(group: any) {
    group.expanded = !group.expanded;
  }

  goBack() {
    if (this.module) {
      this.router.navigateByUrl(
        '/dashboard/vitals/glucose-type/' + this.module
      );
      return;
    }
    this.router.navigateByUrl('/glucose-type');
  }

  addPostPrandial() {
    if (this.module) {
      this.router.navigateByUrl(
        '/dashboard/vitals/add-post-prandial/' + this.module
      );
      return;
    }
    this.router.navigateByUrl('add-post-prandial');
  }

  showPrandialCard() {
    this.showCard = !this.showCard;
  }

  newDateFormat(dateStr: any, time: any) {
    return moment.utc(`${dateStr} ${time}`).local().fromNow();
  }

  getPostprandialColor(status: string) {
    switch (status) {
      case 'Low':
        return 'status-low';
      case 'Normal':
        return 'status-normal';
      case 'Pre-diabetic':
        return 'status-pre-diabetic';
      case 'Diabetic':
        return 'status-diabetic';
      default:
        return 'status-default';
    }
  }
}
