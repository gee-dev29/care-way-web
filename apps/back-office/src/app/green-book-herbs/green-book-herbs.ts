import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageBody } from '@healbridge/ui';
import { GreenBookTable } from '../green-book-table/green-book-table';
import { GreenBookType } from '@healbridge/api';

@Component({
  selector: 'back-office-green-book-herbs',
  imports: [CommonModule, PageBody, GreenBookTable],
  templateUrl: './green-book-herbs.html',
  styleUrl: './green-book-herbs.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GreenBookHerbs {
  greenBookType = GreenBookType;
}
