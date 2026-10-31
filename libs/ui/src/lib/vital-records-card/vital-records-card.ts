import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonIcon,
  IonText,
  IonList,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { shareOutline, chevronBackOutline } from 'ionicons/icons';
import { ButtonComponent } from '../button/button.component';
import { Observable, shareReplay, Subject, takeUntil } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'ui-vital-records-card',
  imports: [
    IonIcon,
    IonText,
    IonList,
    NgTemplateOutlet,
    ButtonComponent,
    IonList,
    IonSkeletonText,
    CommonModule,
  ],
  templateUrl: './vital-records-card.html',
  styleUrl: './vital-records-card.css',
})
export class VitalRecordsCard implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  @Input() tabContents: TemplateRef<any>[] = [];
  @Input() title: string;
  @Input() record: any;
  @Input() showShare = true;
  @Input() storageService: any;
  @Input() records$: Observable<any>;
  moment = moment;
  @Input() cardTitle: string;
  @Input() subtitle: string;
  @Input() cardIcon: string;
  @Input() navigateTo = '/dashboard/vitals';
  @Input() vitalType: any;
  @Input() vitalSignType: any;
  @Input() tabs: string[] = [];
  @Input() label: string;
  @Output() continue = new EventEmitter<void>();
  private destroy$ = new Subject<void>();

  activeTabIndex = 0;
  constructor() {
    addIcons({
      'share-outline': shareOutline,
      'chevron-back-outline': chevronBackOutline,
    });
  }

  ngOnInit(): void {
    this.storageService?.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((type: any) => {
        this.route.params.subscribe((params: any) => {
          const module = params.module;
          const vitalType = params.vitalType;
          if (module) {
            this.navigateTo = '/dashboard/vitals';
          }
          if (module && vitalType) {
            this.navigateTo = `/dashboard/vitals/glucose-type/${module}`;
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack() {
    this.router.navigateByUrl(this.navigateTo);
  }
  setTab(i: number) {
    this.activeTabIndex = i;
  }
  handleContinue() {
    this.continue.emit();
  }
}
