import { Component, inject, OnInit } from '@angular/core';
import { PageBody } from '@care-way/ui';
import { BankTables } from '../bank-tables/bank-tables';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'back-office-list-all-banks',
  imports: [PageBody, BankTables],
  templateUrl: './list-all-banks.html',
  styleUrl: './list-all-banks.css',
})
export class ListAllBanks implements OnInit {
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {}
}
