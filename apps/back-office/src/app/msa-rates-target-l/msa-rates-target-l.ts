import { Component } from '@angular/core';
import { MsaType } from '@care-way/api';
import { PageBody } from '@care-way/ui';
import { MsaRatesTable } from '../msa-rates-table/msa-rates-table';

@Component({
  selector: 'back-office-msa-rates-target-l',
  imports: [PageBody, MsaRatesTable],
  templateUrl: './msa-rates-target-l.html',
  styleUrl: './msa-rates-target-l.css',
})
export class MsaRatesTargetL {
  msaType = MsaType.TargetL;
}
