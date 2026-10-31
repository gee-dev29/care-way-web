import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GreenBookTable } from '../green-book-table/green-book-table';
import { GreenBookType } from '@healbridge/api';
import { PageBody } from '@healbridge/ui';

@Component({
  selector: 'back-office-green-book-vaccines-biologics',
  imports: [CommonModule, GreenBookTable, PageBody],
  templateUrl: './green-book-vaccines-biologics.html',
  styleUrl: './green-book-vaccines-biologics.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GreenBookVaccinesBiologics {
  greenBookType = GreenBookType;
}
