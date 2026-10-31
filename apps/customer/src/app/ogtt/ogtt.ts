import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, VitalSignType } from '@healbridge/api';
import { TestingType } from '@healbridge/shared';
import { StorageService } from '@healbridge/ui';
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonList,
  IonSkeletonText,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronUpOutline } from 'ionicons/icons';
import moment from 'moment';
import { map, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-ogtt',
  imports: [
    IonList,
    IonContent,
    IonIcon,
    IonText,
    IonSkeletonText,
    IonBadge,
    CommonModule,
    IonCard,
    IonCardContent,
  ],
  templateUrl: './ogtt.html',
  styleUrl: './ogtt.css',
})
export class Ogtt implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private storageService = inject(StorageService);
  private api = inject(ApiService);
  private destroy$ = new Subject<void>();

  module: string | null;
  vitalType: any;
  memberId: string;
  loaded = true;
  vitalSignType = VitalSignType.Glucose;
  records$: Observable<any>;

  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      chevronUpOutline,
    });
  }

  ngOnInit() {
    this.vitalType = TestingType.OGTT;
    this.storageService.user$.subscribe((user) => {
      this.memberId = user;
      this.initPage();
    });
  }

  ionViewWillEnter() {
    this.storageService.user$.subscribe((user) => {
      this.memberId = user;
      this.initPage();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initPage() {
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
    });
    this.memberId = JSON.parse(localStorage.getItem('memberId') as any);
    this.getMemberVitalSignHistory(this.memberId, this.vitalType);
  }

  getMemberVitalSignHistory(memberId: string, vitalType: any) {
    this.records$ = this.api
      .getMemberVitalSignHistory({
        memberId,
        vitalSign: this.vitalSignType,
      })
      .pipe(
        map((records: any[]) => {
          this.loaded = false;

          return records
            .filter((record) =>
              record.readings?.some(
                (r: any) => r.testingType === TestingType.OGTT
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

  newDateFormat(dateStr: any, time: any) {
    return moment.utc(`${dateStr} ${time}`).local().fromNow();
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

  addOGTT() {
    if (this.module) {
      this.router.navigateByUrl('/dashboard/vitals/add-ogtt/' + this.module);
      return;
    }
    this.router.navigateByUrl('/glucose-type');
  }
}
