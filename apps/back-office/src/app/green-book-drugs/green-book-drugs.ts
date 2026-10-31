import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GreenBookTable } from '../green-book-table/green-book-table';
import { GreenBookType } from '@care-way/api';
import { CommonModule } from '@angular/common';
import { PageBody } from '@care-way/ui';

@Component({
  selector: 'back-office-green-book-drugs',
  imports: [CommonModule, GreenBookTable, PageBody],
  templateUrl: './green-book-drugs.html',
  styleUrl: './green-book-drugs.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GreenBookDrugs {
  greenBookType = GreenBookType;
}
