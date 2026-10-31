import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  documentOutline,
} from 'ionicons/icons';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'agency-all-users',
  imports: [IonContent, IonIcon, AsyncPipe],
  templateUrl: './all-users.html',
  styleUrl: './all-users.css',
})
export class AllUsers {
  private api = inject(ApiService);
  private router = inject(Router);
  private auth = inject(AuthService);
  users$: Observable<any>;
  usersTotalRecord: number;

  constructor() {
    addIcons({ chevronBackOutline, chevronForwardOutline, documentOutline });
  }

  ionViewWillEnter() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.users$ = this.api
      .getAllUsers({
        limit: 1000,
        agentId: this.auth.getUserId(),
      })
      .pipe(
        map((res: any) => {
          const data = res.data.filter((user: any) => user.agentId !== null);
          return data;
        })
      );
  }

  routeTo(url: string, id?: string) {
    if (id) {
      return this.router.navigateByUrl(url + `/${id}`);
    }
    return this.router.navigateByUrl(url);
  }
}

type TabKey = 'Customers' | 'Medical Facilities';

interface Tab {
  key: TabKey;
  label: string;
}
