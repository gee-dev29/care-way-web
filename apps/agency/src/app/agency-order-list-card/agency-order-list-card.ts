import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { IonText } from '@ionic/angular/standalone';
import moment from 'moment';

@Component({
  selector: 'agency-agency-order-list-card',
  imports: [IonText, CommonModule],
  templateUrl: './agency-order-list-card.html',
  styleUrl: './agency-order-list-card.css',
})
export class AgencyOrderListCard implements OnInit {
  order = input<any>();
  openOrder = output<any>();
  moment = moment;
  totalCost: number;
  ngOnInit() {
    this.totalCost = this.order().orderItems.reduce(
      (acc: number, curr: any) => acc + curr.cost,
      0
    );
  }
}
