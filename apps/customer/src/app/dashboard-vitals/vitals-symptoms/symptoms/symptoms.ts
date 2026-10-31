import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, VitalSignType } from '@care-way/api';
import {
  IonContent,
  IonIcon,
  IonSkeletonText,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { StorageService } from '@care-way/ui';

@Component({
  selector: 'app-symptoms',
  imports: [IonContent, IonText, IonIcon, CommonModule, IonSkeletonText],
  templateUrl: './symptoms.html',
  styleUrl: './symptoms.css',
})
export class Symptoms implements OnInit {
  private router = inject(Router);
  private storageService = inject(StorageService);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  module: string | null;
  memberId: string | null = null;

  constructor() {
    addIcons({
      chevronForwardOutline,
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
    });

    this.storageService.user$.subscribe((user) => {
      this.memberId = user;
      if (this.memberId) {
        this.getMemberVitalSignHistory(this.memberId);
      }
    });
  }
  symtoms$: Observable<any>;

  onNavigate() {
    if (this.module) {
      this.router.navigateByUrl(
        `/dashboard/vitals/add-symptoms/${this.module}`
      );
    }
  }

  viewDetails(id: string) {
    if (this.module) {
      this.router.navigateByUrl(
        `/dashboard/vitals/symptoms-details/${id}/${this.module}`
      );
    }
  }

  getMemberVitalSignHistory(memberId: string) {
    this.symtoms$ = this.api.getMemberVitalSignHistory({
      memberId,
      vitalSign: VitalSignType.Symptom,
    });
  }

  goBack(){
     this.router.navigateByUrl(
        `/dashboard/vitals`
      );
  }
}
