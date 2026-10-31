import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'ui-tab',
  imports: [CommonModule, TabsModule],
  templateUrl: './tab.html',
  styleUrl: './tab.css',
})
export class Tab {
  @Input() items: MenuItem[] = [];
  @Input() tabs: { title: string; value: number; content: string }[] = [];
  @Input() value: number;
  @Output() tabChange = new EventEmitter<number>();

  onTabChange(value: string | number | undefined) {
    if (typeof value === 'number') {
      this.tabChange.emit(value);
    }
  }
}
