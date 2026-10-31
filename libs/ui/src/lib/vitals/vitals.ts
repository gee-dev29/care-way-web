import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonIcon, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'ui-vitals',
  imports: [IonIcon, IonText, CommonModule],
  templateUrl: './vitals.html',
  styleUrl: './vitals.css',
})
export class Vitals implements OnInit {
  url: string;
  suffix: any;
  @Input() items: any[] = [];
  @Output() getItems = new EventEmitter();
  @Output() navigate = new EventEmitter();

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.getItems.emit();
  }
}
