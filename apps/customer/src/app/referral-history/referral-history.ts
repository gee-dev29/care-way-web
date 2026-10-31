import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import {
  IonContent,
  IonIcon,
  IonSkeletonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-referral-history',
  imports: [IonIcon, IonContent, IonSkeletonText, CommonModule],
  templateUrl: './referral-history.html',
  styleUrl: './referral-history.css',
})
export class ReferralHistory implements OnInit {
  private router = inject(Router);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  loaded = false;
  users: any;

  ngOnInit() {
    const userId = this.auth.getUserId();
    this.api.getAllUsers({ agentId: userId } as any).subscribe((res) => {
      this.users = res.data;
      this.loaded = true;
    });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/referral');
  }
}
