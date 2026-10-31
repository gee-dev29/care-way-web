import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OrderTable } from '../order-table/order-table';
import { PageBody } from '@care-way/ui';

@Component({
  selector: 'back-office-list-all-orders',
  imports: [OrderTable, PageBody],
  templateUrl: './list-all-orders.html',
  styleUrl: './list-all-orders.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListAllOrders {}
