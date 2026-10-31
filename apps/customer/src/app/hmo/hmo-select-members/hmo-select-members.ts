import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Member } from '@care-way/api';
import { AuthService, LimitSize } from '@care-way/shared';
import { ButtonComponent, ToastService } from '@care-way/ui';
import {
  IonAvatar,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import moment from 'moment';
import { map } from 'rxjs';

import { HmoJourneyService } from '@care-way/shared';

type MemberRow = Member & { age?: number; profilePicture?: string | null };

@Component({
  selector: 'app-hmo-select-members',
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonAvatar,
    IonCheckbox,
    IonSkeletonText,
    ButtonComponent,
  ],
  templateUrl: './hmo-select-members.html',
  styleUrl: './hmo-select-members.css',
})
export class HmoSelectMembers {
  private router = inject(Router);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private journey = inject(HmoJourneyService);
  private toast = inject(ToastService);

  members: MemberRow[] = [];
  selectedIds = new Set<string>();
  loaded = false;
  failed = false;
  skeletons = ['', '', '', ''];
  memberCount = 0;

  constructor() {
    addIcons({ 'left-arrow': chevronBackOutline });
  }

  ionViewWillEnter() {
    this.memberCount = this.journey.state.hmoProduct?.memberCount ?? 0;
    this.selectedIds = new Set(
      (this.journey.state.selectedMembers ?? [])
        .map((member) => member.memberId)
        .filter(Boolean) as string[]
    );

    this.loaded = false;
    this.failed = false;

    this.auth.userDetail(this.api, (auth: any) => {
      this.api
        .getMembers({
          referencedDocumentId: auth?.jti,
          skip: 0,
          limit: LimitSize.DropDown,
        })
        .pipe(
          map((response) =>
            (response?.data ?? []).map((member) => ({
              ...member,
              age: member.dob
                ? moment().diff(moment(member.dob), 'years')
                : undefined,
              profilePicture: null,
            }))
          )
        )
        .subscribe({
          next: (members: MemberRow[]) => {
            this.members = members;
            this.loaded = true;
            members.forEach((member) => this.loadPicture(member));
          },
          error: () => {
            this.failed = true;
            this.loaded = true;
          },
        });
    });
  }

  private loadPicture(member: MemberRow) {
    if (!member.memberId) return;
    this.api
      .getUploads({ referencedDocumentId: member.memberId })
      .pipe(
        map((uploads: any[]) =>
          uploads?.length ? uploads[uploads.length - 1].url : null
        )
      )
      .subscribe({
        next: (url) => (member.profilePicture = url),
        error: () => (member.profilePicture = null),
      });
  }

  isSelected(member: MemberRow) {
    return this.selectedIds.has(member.memberId as string);
  }

  toggle(member: MemberRow) {
    const id = member.memberId as string;
    if (!id) return;

    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
      return;
    }
    if (this.memberCount && this.selectedIds.size >= this.memberCount) {
      this.toast.show(
        `This plan covers up to ${this.memberCount} member${
          this.memberCount === 1 ? '' : 's'
        }.`,
        'error'
      );
      return;
    }
    this.selectedIds.add(id);
  }

  get canProceed() {
    return this.selectedIds.size > 0;
  }

  initials(member: MemberRow) {
    return `${member.firstName?.[0] ?? ''}${member.lastName?.[0] ?? ''}`;
  }

  proceed() {
    if (!this.canProceed) return;
    const selected = this.members.filter((member) => this.isSelected(member));
    this.journey.patch({ selectedMembers: selected });
    this.router.navigateByUrl('/dashboard/hmo-preferred-hospital');
  }

  back() {
    const { hmo, hmoProduct } = this.journey.state;
    this.router.navigate([
      '/dashboard/hmo-product-details',
      hmo?.hmoId,
      hmoProduct?.hmoProductId,
    ]);
  }
}
