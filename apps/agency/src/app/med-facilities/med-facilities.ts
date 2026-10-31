import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, documentOutline } from 'ionicons/icons';
import { map, Observable } from 'rxjs';
import { MedFacilityHomeCard } from '../med-facility-home-card/med-facility-home-card';

@Component({
  selector: 'agency-med-facilities',
  imports: [MedFacilityHomeCard, IonContent, IonIcon, AsyncPipe],
  templateUrl: './med-facilities.html',
  styleUrl: './med-facilities.css',
})
export class MedFacilities {
  private api = inject(ApiService);
  private router = inject(Router);
  private auth = inject(AuthService);
  filters: any;
  orders$: Observable<any>;

  constructor() {
    addIcons({ chevronBackOutline, documentOutline });
  }
  ionViewWillEnter() {
    this.getFacilities();
  }
  routeTo(url: string, id?: string) {
    if (id) {
      return this.router.navigateByUrl(url + `/${id}`);
    }

    return this.router.navigateByUrl(url);
  }
  getFacilities() {
    this.filters = {
      skip: 0,
      limit: 1000,
      agentId: this.auth.getUserId(),
    };
    this.orders$ = this.api
      .getFacilities(this.filters)
      .pipe(map((res: any) => res.data));
  }
}
