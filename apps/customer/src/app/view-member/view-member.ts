import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '@healbridge/api';
import {
  IonContent,
  IonIcon,
  IonCard,
  IonRow,
  IonCol,
  IonAvatar,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-view-member',
  imports: [
    IonContent,
    IonIcon,
    IonCard,
    IonRow,
    IonCol,
    IonAvatar,
    IonSkeletonText,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './view-member.html',
  styleUrl: './view-member.css',
})
export class ViewMember {
  member$: Observable<any>;
  public router = inject(Router);
  public api = inject(ApiService);
  public activatedRoute = inject(ActivatedRoute);
  memberId: string;
  picture$: Observable<string | null>;

  constructor() {
    addIcons({
      'left-arrow': chevronBackOutline,
    });
  }
  ionViewWillEnter(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.memberId = params.memberId;
      this.member$ = this.api.getMember({ memberId: params.memberId });
      this.picture$ = this.getProfilePicture(params.memberId);
    });
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
  editDetails() {
    this.router.navigate(['dashboard/add-member', this.memberId]);
  }
}
