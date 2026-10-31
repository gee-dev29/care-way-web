import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { DocumentStatus, ProfileInfoService } from '@healbridge/shared';
import { StorageService } from '@healbridge/ui';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  addOutline,
  attachOutline,
  chevronBackOutline,
} from 'ionicons/icons';
import moment from 'moment';
import {
  forkJoin,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-all-help-requests',
  imports: [IonContent, CommonModule, IonIcon],
  templateUrl: './all-help-requests.html',
  styleUrl: './all-help-requests.css',
})
export class AllHelpRequests implements OnDestroy {
  private api = inject(ApiService);
  private profileInfoService = inject(ProfileInfoService);
  private storageService = inject(StorageService);
  costFlow: string;
  activeStatus = 'All';
  private route = inject(Router);
  DocumentStatus = DocumentStatus;
  requests: any = [];
  private router = inject(Router);
  requests$: Observable<any>;
  private destroy$ = new Subject<void>();
  user: any;
  moment = moment;
  constructor() {
    addIcons({
      addOutline,
      addCircleOutline,
      'attach-outline': attachOutline,
      chevronBackOutline,
    });
  }

  ionViewWillEnter() {
    this.storageService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((type: any) => {
        this.load(type);
      });
  }

  load(memberId: any) {
    this.api.getMember({ memberId: memberId }).subscribe((member: any) => {
      this.requests$ = this.api
        .getOrderPaymentHelpRequests({
          email: member.email,
        } as any)
        .pipe(
          switchMap((response: any) => {
            const requests = response.data;
            return forkJoin(
              requests.map((req: any) =>
                forkJoin({
                  member: this.api.getMember({ memberId: member.memberId }),
                }).pipe(
                  map(({ member }) => {
                    const newMember = {
                      ...member,
                    };
                    return {
                      ...req,
                      member: newMember,
                    };
                  })
                )
              )
            );
          }),
          tap((requestsWithDetails) => {
            this.requests = requestsWithDetails;
            this.filteredRequests();
          })
        );
    });
  }

  setStatus(status: any) {
    this.activeStatus = status;
    this.filteredRequests();
  }

  navigateTo(item: any) {
    this.router.navigateByUrl(
      `/dashboard/help-page-detail/${item.orderId}/${item.helpId}/user`
    );
  }

  goto() {
    this.router.navigateByUrl('dashboard/prescription');
  }

  filteredRequests() {
    if (this.activeStatus != 'All') {
      this.requests$ = of(
        this.requests.filter((req: any) => req.status === this.activeStatus)
      );
    } else {
      this.requests$ = of(this.requests);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack() {
    this.route.navigateByUrl('dashboard/home');
  }
}
