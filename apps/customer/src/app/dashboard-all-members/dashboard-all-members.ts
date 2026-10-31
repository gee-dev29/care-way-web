import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService, LimitSize } from '@care-way/shared';
import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import moment from 'moment';
import { map, Observable } from 'rxjs';
import { PlusIconComponent } from "@care-way/ui";

@Component({
  selector: 'app-dashboard-all-members',
  imports: [IonContent, IonIcon, IonAvatar, CommonModule, IonSkeletonText, PlusIconComponent, RouterLink],
  templateUrl: './dashboard-all-members.html',
  styleUrl: './dashboard-all-members.css',
})
export class DashboardAllMembers {
  private router = inject(Router);
  allMembers$: Observable<any>;
  private api = inject(ApiService);
  public auth = inject(AuthService);
  loaded = false;
  img = 'images/man-profile2.svg';
  members = [''];

  constructor() {
    addIcons({
      'left-arrow': chevronBackOutline,
      'right-arrow': chevronForwardOutline,
    });
  }

  ionViewWillEnter(): void {
    this.auth.userDetail(this.api, (auth) => {
      this.allMembers$ = this.api
        .getMembers({
          referencedDocumentId: auth?.jti as any,
          skip: 0,
          limit: LimitSize.DropDown as any,
        })
        .pipe(
          map((response: any) => {
            const members: any = [];
            response.data.forEach((eachMember: any) => {
              eachMember.age = moment().diff(moment(eachMember.dob), 'years');
              this.getProfilePicture(eachMember.memberId).subscribe(
                (url: any) => {
                  eachMember.profilePicture = url;
                }
              );
              members.push(eachMember);
            });
            return members;
          })
        );
    });
  }

  back() {
    this.router.navigate(['dashboard/home']);
  }

  memberProfile(memberId: string) {
    this.router.navigate(['/dashboard/member-details', memberId]);
  }

  getProfilePicture(referencedDocumentId: string) {
    return this.api
      .getUploads({ referencedDocumentId })
      .pipe(
        map((response: any[]) =>
          response?.length ? response[response.length - 1].url : null
        )
      );
  }

  addMember(){
    this.router.navigate(['/dashboard/add-member']);
  }
}
