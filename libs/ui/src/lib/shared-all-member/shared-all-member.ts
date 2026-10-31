import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonIcon,
  IonImg,
  IonSkeletonText,
  IonAvatar,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  addCircle,
} from 'ionicons/icons';
import { map, Observable, of, tap } from 'rxjs';
import { PlusIconComponent } from '../plus-icon-component/plus-icon-component';

@Component({
  selector: 'ui-shared-all-member',
  imports: [
    IonIcon,
    IonImg,
    IonSkeletonText,
    CommonModule,
    IonAvatar,
    IonText,
    PlusIconComponent,
  ],
  templateUrl: './shared-all-member.html',
  styleUrl: './shared-all-member.css',
})
export class SharedAllMember implements OnInit, OnChanges {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  loaded = false;
  @Input() heading: string;
  @Input() auth: any;
  @Input() api: any;
  @Input() cardColor: any;
  @Input() border = 'none';
  @Input() facilityType: string;
  facilityId: any;
  @Input() FacilityType: any;
  @Input() routeTo: string;
  @Input() addRoute: string;
  @Input() professionalType: string;
  @Input() facilityTypeIdOverride?: string;
  @Input() isNurse = false;
  @Input() showAdd = true;
  @Input() backRoute?: string;
  filteredItems: any[] = [];
  facilityTypeId: string;
  professional$: Observable<any>;
  pharms: any = [0, 0, 2];

  constructor() {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      addCircle,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.load();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(() => {
      this.load();
    });
  }

  load() {
    if (this.isNurse) {
      this.loaded = true;
      if (!this.facilityTypeIdOverride) {
        this.professional$ = of([]);
        return;
      }
      this.facilityTypeId = this.facilityTypeIdOverride;
      this.fetchProfessionals();
      return;
    }

    this.auth.userDetail(this.api, (auth: any) => {
      this.facilityId = auth?.userTypeId;
      const facilityType = JSON.parse(
        localStorage.getItem('facilityType') as any
      );
      const facilityTypeId = JSON.parse(
        localStorage.getItem('facilityTypeId') as any
      );
      this.loaded = true;
      switch (facilityType) {
        case this.FacilityType.Pharmacy:
          this.facilityTypeId = facilityTypeId;
          break;
        case this.FacilityType.Hospital:
          this.facilityTypeId = facilityTypeId;
          break;
        case this.FacilityType.Laboratory:
          this.facilityTypeId = facilityTypeId;
          break;
        case this.FacilityType.BloodBank:
          this.facilityTypeId = facilityTypeId;
          break;
        case this.FacilityType.Radiology:
          this.facilityTypeId = facilityTypeId;
          break;
      }
      this.fetchProfessionals();
    });
  }

  private fetchProfessionals() {
    if (!this.facilityTypeId) {
      this.professional$ = of([]);
      return;
    }
    this.professional$ = this.api
      .getProfessionalsInFacilityType({
        facilityTypeId: this.facilityTypeId,
        professionalType: this.professionalType,
      })
      .pipe(
        tap((response: any) => {
          const professionals = Array.isArray(response) ? response : [];
          this.pharms = professionals;
          this.filteredItems = this.pharms;
        }),
        map((response: any) => (Array.isArray(response) ? response : []))
      );
  }

  goBack() {
    this.router.navigateByUrl(this.backRoute ?? '/dashboard/home');
  }

  viewProfile(id: string) {
    if (!this.routeTo) {
      return;
    }
    this.router.navigate([this.routeTo, id]);
  }

  searchInput(event: any) {
    const value = event.detail.value.toLowerCase();
    this.filteredItems = this.pharms.filter((data: any) =>
      data.name.toLowerCase().includes(value)
    );
    this.professional$ = of(this.filteredItems);
  }

  addPharm() {
    this.router.navigateByUrl(this.addRoute);
  }
}
