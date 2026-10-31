import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import { AddNewEntryCard } from '@care-way/ui';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'agency-bank-account',
  imports: [AddNewEntryCard, AsyncPipe, IonIcon, IonContent, IonText],
  templateUrl: './bank-account.html',
  styleUrl: './bank-account.css',
})
export class BankAccount {
  public api = inject(ApiService);
  public auth = inject(AuthService);

  private router = inject(Router);
  bank$: Observable<any>;
  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }
  bank: any;
  agentId: any;

  ionViewWillEnter() {
    this.agentId = this.auth.getUserId();
    this.bank$ = this.api
      .getBankAccount({
        referencedDocumentId: this.agentId,
      })
      .pipe(map((res: any[]) => (res.length ? res[0] : null)));
  }

  addNew(route: string) {
    this.router.navigate([route, this.agentId, 'profile']);
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  editBank(bank: any) {
    this.router.navigate([
      '/dashboard/add-bank-agency',
      bank.referencedDocumentId,
      'edit',
      bank.bankAccountId,
    ]);
  }
}
