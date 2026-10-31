import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonImg } from '@ionic/angular/standalone';
import moment from 'moment';

@Component({
  selector: 'ui-cost-card',
  imports: [IonImg, CommonModule],
  templateUrl: './cost-card.html',
  styleUrl: './cost-card.css',
})
export class CostCard implements OnInit {
  private router = inject(Router);
  @Input() bg = '#ffffff';
  @Input() bdColor = 'none';
  @Input() viewAllColor = '#007bff';
  @Input() route: string;
  @Input() name = 'Olivia Johnson';
  @Output() viewAll = new EventEmitter<any>();
  @Output() viewIt = new EventEmitter<any>();
  @Input() costRequest: any;
  moment = moment;
  @Input() isList: any;

  ngOnInit(): void {    
    if (this.router.url.includes('dashboard/home')) {
      this.isList = true;
    }
  }

  viewDetails(serviceRequestId: string, memberId: any) {
    if (this.route) {
      this.router.navigate([this.route, serviceRequestId, memberId]);
    }
  }
  onViewAll(event: Event) {
    event.stopPropagation();
    this.viewAll.emit();
  }
}
