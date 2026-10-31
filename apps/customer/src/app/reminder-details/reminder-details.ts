import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@care-way/ui';
import { IonCard, IonText } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';

interface Reminder {
  time: string;
  startDate: string;
  endDate: string;
  meds: {
    name: string;
    dosage: string;
    color: string;
  }[];
}
@Component({
  selector: 'app-reminder-details',
  imports: [CommonModule, IonText, ButtonComponent, IonCard],
  templateUrl: './reminder-details.html',
  styleUrl: './reminder-details.css',
})
export class ReminderDetails implements OnInit, OnDestroy {
  selectedFullDate: string;
  weekDays: any[] = [];
  activeTimeIndex = 0;
  selectedDateISO!: string;
  reminders: Reminder[] = [];
  groupedReminders: Reminder[] = [];
  private destroy$ = new Subject<void>();
  private router = inject(Router);

  constructor() {
    //
  }

  ngOnInit(): void {
    this.generateWeekDays();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createReminder() {
    this.router.navigateByUrl('dashboard/create-reminder');
  }

  generateWeekDays() {
    const today = new Date();
    this.weekDays = [];
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      this.weekDays.push({
        date: d,
        short: d
          .toLocaleDateString('en-US', { weekday: 'short' })
          .toUpperCase(),
        num: d.getDate(),
        active: d.toDateString() === today.toDateString(),
      });
    }
    this.updateSelectedDateDisplay(today);
    this.loadRemindersForDate(today);
  }
  selectDay(day: any) {
    this.weekDays.forEach((d) => (d.active = false));
    day.active = true;
    this.updateSelectedDateDisplay(day.date);
    this.loadRemindersForDate(day.date);
  }

  updateSelectedDateDisplay(date: Date) {
    const options: any = { month: 'long', day: 'numeric' };
    const formatted = date.toLocaleDateString('en-US', options);
    this.selectedFullDate = formatted;
  }

  setActive(index: number) {
    // this.activeTimeIndex = index;
  }

  loadRemindersForDate(date: Date) {
    const selectedDate =
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0');

    const stored = localStorage.getItem('reminders');
    const reminders: Reminder[] = stored ? JSON.parse(stored) : [];
    const filters = reminders.filter(
      (r) => selectedDate >= r.startDate && selectedDate <= r.endDate
    );
    this.reminders = this.groupRemindersByTime(filters);
  }

  groupRemindersByTime(reminders: Reminder[]): Reminder[] {
    const map = new Map<string, Reminder>();
    reminders.forEach((reminder, index: any) => {
      if (map.has(reminder.time)) {
        this.activeTimeIndex = index;
        map.get(reminder.time)?.meds.push(...reminder.meds);
      } else {
        map.set(reminder.time, {
          time: reminder.time,
          startDate: reminder.startDate,
          endDate: reminder.endDate,
          meds: [...reminder.meds],
        });
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      a.time.localeCompare(b.time)
    );
  }
}
