import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import {
  AuthService,
  FacilityTypeService,
  LimitSize,
  NurseActiveFacility,
} from '@healbridge/shared';
import { PlusIconComponent } from '@healbridge/ui';
import {
  IonContent,
  IonIcon,
  IonSearchbar,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import moment from 'moment';
import { map, Observable, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-all-patient',
  imports: [
    IonSearchbar,
    IonContent,
    IonIcon,
    IonSkeletonText,
    CommonModule,
    PlusIconComponent,
  ],
  templateUrl: './all-patient.html',
  styleUrl: './all-patient.css',
})
export class AllPatient implements OnDestroy {
  loaded = false;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  allMembers$: Observable<any>;
  private api = inject(ApiService);
  patient: any = [];
  public auth = inject(AuthService);
  private facilityTypeService = inject(FacilityTypeService);
  private nurseActiveFacility = inject(NurseActiveFacility);
  facilityTypeId: string;
  facilityType: string;
  facilityId: any;
  isNurse = false;
  professionalId = '';
  private destroy$ = new Subject<void>();

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  private fetchMembers(facilityTypeId: string) {
    this.allMembers$ = this.api
      .getMembersInFacilityType({
        facilityTypeId,
      })
      .pipe(
        map((response: any) => {
          const members: any = [];
          response.forEach((eachMember: any) => {
            if (eachMember != null) {
              eachMember.age = moment().diff(
                moment(eachMember?.dob),
                'years'
              );
              members.push(eachMember);
            }
          });
          this.patient = members;
          return members;
        })
      );
  }

  loadProfile(facilityType: any) {
    this.facilityType = facilityType;
    this.loaded = true;
    this.auth.userDetail(this.api, (auth) => {
      this.facilityId = auth?.userTypeId;
      const facilityType = JSON.parse(
        localStorage.getItem('facilityType') as any
      );
      if (facilityType === this.facilityType && FacilityType.Hospital) {
        this.facilityTypeId = JSON.parse(
          localStorage.getItem('facilityTypeId') as any
        );
        this.fetchMembers(this.facilityTypeId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ionViewWillEnter(): void {
    const professionalId = this.activatedRoute.snapshot.paramMap.get(
      'professionalId'
    );

    if (professionalId) {
      this.isNurse = true;
      this.professionalId = professionalId;
      this.loaded = true;
      this.nurseActiveFacility.activeFacilityId$
        .pipe(takeUntil(this.destroy$))
        .subscribe((facilityId) => {
          this.facilityId = facilityId ?? undefined;
        });
      this.nurseActiveFacility.activeFacilityTypeId$
        .pipe(takeUntil(this.destroy$))
        .subscribe((facilityTypeId) => {
          this.facilityTypeId = facilityTypeId ?? '';
          if (!facilityTypeId) {
            this.patient = [];
            this.allMembers$ = of([]);
            return;
          }
          this.fetchMembers(facilityTypeId);
        });
      return;
    }

    this.facilityTypeService.facilityType$
      .pipe(takeUntil(this.destroy$))
      .subscribe((type: any) => {
        this.facilityType = type;
        this.loadProfile(this.facilityType);
      });
  }

  filteredItems: any[] = [];
  searchTerm = '';

  searchbarInput(event: any) {
    const value = (event.target.value || '').toLowerCase();
    this.searchTerm = event.target.value || '';
    this.filteredItems = this.patient.filter(
      (i: any) =>
        i.firstName.toLowerCase().includes(value) ||
        i.lastName.toLowerCase().includes(value)
    );
    this.allMembers$ = of(this.filteredItems);
  }

  goBack() {
    if (this.isNurse) {
      this.router.navigate(['/nurse-dashboard', this.professionalId]);
      return;
    }
    this.router.navigateByUrl('/dashboard/home');
  }

  addPatient() {
    this.router.navigate([
      '/dashboard/add-patient',
      this.facilityType,
      this.facilityId,
      this.facilityTypeId,
    ]);
  }

  viewPatient(memberId: any) {
    if (this.isNurse) {
      this.router.navigate([
        '/nurse-dashboard',
        this.professionalId,
        'patient-profile',
        this.facilityId,
        this.facilityTypeId,
        memberId,
      ]);
      return;
    }
    this.router.navigate([
      '/dashboard/patient-profile',
      this.facilityType,
      this.facilityId,
      this.facilityTypeId,
      memberId,
    ]);
  }
  calculateAge(dob: any): number {
    return moment().diff(moment(dob), 'years');
  }
}
