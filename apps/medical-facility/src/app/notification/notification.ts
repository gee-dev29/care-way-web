import { CommonModule, Location } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

export interface NotificationItem {
  id: string;
  read: boolean;
  icon: string;
  titleHighlight?: string;
  message?: string;
  button?: { label: string; route?: string };
  time: string;
}

export const NOTIFICATIONS_STORAGE_KEY = 'facilityDummyNotifications';

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    read: false,
    icon: '/icons/Appointments.svg',
    titleHighlight: 'New appointment request.',
    message: 'A patient has requested an appointment. Tap to review and confirm.',
    time: '2m',
  },
  {
    id: '2',
    read: false,
    icon: '/icons/Patients.svg',
    titleHighlight: 'Patient checked in.',
    message: 'John Doe has checked in for their 10:00 AM appointment.',
    time: '20m',
  },
  {
    id: '3',
    read: true,
    icon: '/icons/notification.svg',
    titleHighlight: 'Lab result ready.',
    message: 'Lab results for patient Jane Smith are ready for review.',
    time: '3h',
  },
  {
    id: '4',
    read: true,
    icon: '/icons/notification.svg',
    titleHighlight: 'Shift reminder.',
    message: 'Your shift starts in 30 minutes.',
    time: '15h',
  },
];

function loadNotifications(): NotificationItem[] {
  const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify(DEFAULT_NOTIFICATIONS)
  );
  return DEFAULT_NOTIFICATIONS;
}


export const notifications$ = new BehaviorSubject<NotificationItem[]>(
  loadNotifications()
);

export function markNotificationAsRead(id: string) {
  const items = notifications$.value;
  const target = items.find((item) => item.id === id);
  if (!target || target.read) {
    return;
  }
  const updated = items.map((item) =>
    item.id === id ? { ...item, read: true } : item
  );
  notifications$.next(updated);
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
}

export function addNotification(payload: {
  id?: string;
  title?: string;
  body?: string;
}) {
  const item: NotificationItem = {
    id: payload.id ?? `${Date.now()}`,
    read: false,
    icon: '/icons/notification.svg',
    titleHighlight: payload.title,
    message: payload.body,
    time: 'now',
  };
  const updated = [item, ...notifications$.value];
  notifications$.next(updated);
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
}

@Component({
  selector: 'medical-facility-notification',
  imports: [
    IonContent,
    IonImg,
    CommonModule,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonNote,
  ],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Notification {
  private router = inject(Router);
  private location = inject(Location);
  notifications$ = notifications$;

  constructor() {
    addIcons({
      'left-arrow': chevronBackOutline,
    });
  }

  goBack() {
    this.location.back();
  }

  viewNotification(item: NotificationItem) {
    markNotificationAsRead(item.id);
    if (item.button?.route) {
      this.router.navigateByUrl(item.button.route);
    }
  }
}
