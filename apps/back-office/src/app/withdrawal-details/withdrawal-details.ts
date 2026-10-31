import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { PageBody, Tab, UploadCard, PageHighlight } from '@care-way/ui';
import { BankDetailsCard } from '../bank-details-card/bank-details-card';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, of, tap } from 'rxjs';
import { ApiService } from '@care-way/api';
import { WithdrawalDetailsCard } from '../withdrawal-details-card/withdrawal-details-card';

@Component({
  selector: 'back-office-withdrawal-details',
  imports: [
    PageBody,
    Tab,
    BankDetailsCard,
    CommonModule,
    UploadCard,
    PageHighlight,
    WithdrawalDetailsCard,
  ],
  templateUrl: './withdrawal-details.html',
  styleUrl: './withdrawal-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WithdrawalDetails implements OnInit {
  router = inject(Router);
  api = inject(ApiService);
  activatedRoute = inject(ActivatedRoute);

  bank$: Observable<any>;
  uploads$: Observable<any>;
  withdrawalDetail$: Observable<any>;
  withdrawalId: string;
  activeTab = 0;
  accountName: string;
  accountNumber: string;
  tabs = [
    { title: 'Details', value: 0, content: 'Details' },
    { title: 'Uploads', value: 1, content: 'Uploads' },
  ];

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.withdrawalId = params.withdrawalId;
      this.getWithdrawal(this.withdrawalId);
      this.getBank();
      this.getUploads(this.withdrawalId);
    });
  }

  getWithdrawal(withdrawalId: string) {
    this.withdrawalDetail$ = this.api
      .getWalletWithdrawal({ withdrawalId })
      .pipe(
        tap((response: any) => {
          this.accountName = response.accountName;
          this.accountNumber = response.accountNumber;
        })
      );
  }

  getBank() {
    this.bank$ = this.api
      .getBankAccount({
        referencedDocumentId: this.withdrawalId,
      })
      .pipe(map((res: any[]) => res[0]));
  }

  getUploads(withdrawalId: string) {
    this.uploads$ = this.api.getUploads({ referencedDocumentId: withdrawalId });
  }

  back() {
    this.router.navigate(['list-all-withdrawals']);
  }
}
