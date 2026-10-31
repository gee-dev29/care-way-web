import { Component } from '@angular/core';
import { PageBody } from '@care-way/ui';
import { MsaRatesTable } from '../msa-rates-table/msa-rates-table';
import { CommonModule } from '@angular/common';
import { MsaType } from '@care-way/api';

@Component({
  selector: 'back-office-msa-rates-future',
  imports: [PageBody, MsaRatesTable, CommonModule],
  templateUrl: './msa-rates-future.html',
  styleUrl: './msa-rates-future.css',
})
export class MsaRatesFuture {
  msaType = MsaType.Future;
}
