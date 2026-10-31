import { Component, Input, Output, EventEmitter } from '@angular/core';
import type { OnInit } from '@angular/core';

import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonItemDivider,
} from '@ionic/angular/standalone';
import { Item } from '../types';

@Component({
  selector: 'ui-typeahead',
  imports: [
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonSearchbar,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonItemDivider,
  ],
  templateUrl: './typeahead.html',
  styleUrl: './typeahead.css',
})
export class Typeahead implements OnInit {
  @Input() items: Item[] = [];
  @Input() selectedItems: any;
  @Input() title = '';
  @Input() label = '';
  @Input() isMultiselect = false;
  @Input() isItemObject = false;
  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<string[]>();
  selectedId: number | null = null;
  filteredItems: Item[] = [];
  workingSelectedValues: any;
  hasGroups = false;
  groups: string[] = [];
  @Input() requiredGroups: string[] = [];
  @Input() emptyGroupMessage: string;

  ngOnInit() {
    this.filteredItems = [...this.items];
    this.workingSelectedValues = this.selectedItems;
    const someItemsHaveAGroup = this.items.some((item) => item.group);
    const hasRequiredGroups = this.requiredGroups.length > 0;
    this.hasGroups = someItemsHaveAGroup || hasRequiredGroups;
    this.groups = this.hasGroups ? this.computeGroups(this.items) : [];
  }

  computeGroups(items: Item[]): string[] {
    const alreadyProcessedGroups = new Set<string>();
    const groupOrder: string[] = [...this.requiredGroups];
    this.requiredGroups.forEach((group) => alreadyProcessedGroups.add(group));
    for (const item of items) {
      const groupName = item.group ?? '';
      if (groupName && !alreadyProcessedGroups.has(groupName)) {
        alreadyProcessedGroups.add(groupName);
        groupOrder.push(groupName);
      }
    }
    return groupOrder;
  }

  itemsForGroup(groupName: string): Item[] {
    return this.filteredItems.filter(
      (item) => (item.group ?? '') === groupName
    );
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  confirmChanges() {
    this.selectionChange.emit(this.workingSelectedValues);
  }

  searchbarInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filterList(inputElement.value);
  }

  filterList(searchQuery: string | undefined) {
    if (searchQuery === undefined || searchQuery.trim() === '') {
      this.filteredItems = [...this.items];
    } else {
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.items.filter((item: any) =>
        item.text.toLowerCase().includes(normalizedQuery)
      );
    }
  }

  isChecked(value: string): boolean {    
    return this.workingSelectedValues.value?.includes(value);
  }

  checkboxChange(event: CustomEvent<{ checked: boolean; value: string }>) {
    const { checked, value } = event.detail;
    if (this.isMultiselect === false) {
      this.workingSelectedValues = value;
      this.confirmChanges();
    } else {
      if (checked) {
        this.workingSelectedValues = [...this.workingSelectedValues, value];
      } else {
        this.workingSelectedValues = this.workingSelectedValues.filter(
          (item: any) => item !== value
        );
      }
    }
  }

  onSelect(item: any) {
    this.selectedId = item.hospitalId;
  }
}
