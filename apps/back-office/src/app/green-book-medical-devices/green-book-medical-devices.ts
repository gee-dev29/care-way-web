import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageBody } from '@care-way/ui';
import { GreenBookTable } from '../green-book-table/green-book-table';
import { CommonModule } from '@angular/common';
import { GreenBookType } from '@care-way/api';

@Component({
  selector: 'back-office-green-book-medical-devices',
  imports: [PageBody, GreenBookTable, CommonModule],
  templateUrl: './green-book-medical-devices.html',
  styleUrl: './green-book-medical-devices.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GreenBookMedicalDevices {
  greenBookType = GreenBookType;
}
