import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'ui-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() unit: string;
  @Input() user$: Observable<any>;
  @Input() api: any;
  @Input() auth: any;
  id$ = new BehaviorSubject(0);
  open = false;
  @Input() sidebarLinks: any;
  @Input() userName: string;
  @Output() logOut = new EventEmitter();
  @Output() singleMenu = new EventEmitter();
  @Input() initials: string;
  show = false;
  name: any;
  private router = inject(Router);

  dropdownPosition = { top: 0, left: 0 };

  setId(index: number, link: DropdownLinks, event: MouseEvent) {
    const trigger = event.currentTarget as HTMLElement;
    const rect = trigger.getBoundingClientRect();

    this.dropdownPosition = {
      top: Math.min(rect.top - 28, window.innerHeight - 180),
      left: rect.right + 8,
    };
    this.name = link?.name;
    this.id$.next(index + 1);
    this.open = !this.open;
    // this.router.navigateByUrl(link?.link);
  }

  closeModal() {
    this.open = false;
    this.show = false;
  }

  closeMenu(link = '') {
    this.id$.next(0);
    this.show = false;
    if (link) {
      this.router.navigateByUrl(link);
    }
  }

  logout() {
    this.logOut.emit('logged-out');
  }

  menu() {
    this.show = !this.show;
  }

  closeSideBar() {
    this.show = false;
  }

  singleClick(link: any) {
    this.singleMenu.emit(link.link);
    this.show = false;
    this.router.navigateByUrl(link.link);
  }
}

export interface SideBar {
  icon: string;
  name: string;
  link?: string;
  dropdownLinks?: DropdownLinks[];
  badgeValue?: string;
  showBadge?: boolean;
}
export interface DropdownLinks {
  link: string;
  name: string;
}
