import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '@healbridge/ui';
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
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

export interface NotificationItem {
  notificationId: string;
  read: boolean;
  body: string;
  icon: string;
  title?: string;
  message?: string;
  button?: { label: string; route?: string };
  notificationType?: { icon: string; name: string };
  time: string;
}

export const NOTIFICATIONS_STORAGE_KEY = 'pushNotifications';

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [];

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

export function markNotificationAsRead(notificationId: string) {
  const items = notifications$.value;
  const target = items.find((item) => item.notificationId === notificationId);
  if (!target || target.read) {
    return;
  }
  const updated = items.map((item) =>
    item.notificationId === notificationId ? { ...item, read: true } : item
  );
  notifications$.next(updated);
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
}

// Called from PushService's pushNotificationReceived listener to feed a real
// push payload into the same list the dummy data lives in.
export function addNotification(payload: any) {
  const item: NotificationItem = {
    notificationId: payload.notificationId,
    read: false,
    icon: '/icons/notification.svg',
    title: payload.title,
    body: payload.body,
    time: 'now',
  };
  const updated = [item, ...notifications$.value];
  notifications$.next(updated);
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
}

@Component({
  selector: 'app-notification',
  imports: [
    RouterLink,
    IonContent,
    IonImg,
    CommonModule,
    IonIcon,
    ButtonComponent,
    IonSkeletonText,
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
  loaded = true;
  notifications$ = notifications$;

  constructor() {
    addIcons({
      'left-arrow': chevronBackOutline,
    });
  }

  viewNotification(item: NotificationItem) {
    markNotificationAsRead(item.notificationId);
    if (item.button?.route) {
      this.router.navigateByUrl(item.button.route);
    }
  }
}
