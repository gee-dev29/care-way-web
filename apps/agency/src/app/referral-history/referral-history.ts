import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import {
  IonIcon,
  IonContent,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'agency-referral-history',
  imports: [IonIcon, IonContent, IonSkeletonText, AsyncPipe],
  templateUrl: './referral-history.html',
  styleUrl: './referral-history.css',
})
export class ReferralHistory implements OnInit {
  private router = inject(Router);
  private api = inject(ApiService);
  public auth = inject(AuthService);
  loaded = true;

  users$: Observable<any>;

  ionViewWillEnter() {
    this.getAllUsers();
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.users$ = this.api
      .getAllUsers({
        agentId: this.auth.getUserId(),
      })
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/referral');
  }
}
