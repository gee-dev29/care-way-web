import { inject, Injectable } from '@angular/core';
import {
  PushNotifications,
  Token,
  ActionPerformed,
  PushNotificationSchema,
} from '@capacitor/push-notifications';
import { ToastService } from './toast';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  private toastr = inject(ToastService);

  async initialize(
    api: any,
    appName: string,
    onNotificationReceived?: (notification: PushNotificationSchema) => void
  ) {
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== 'granted') {
      return;
    }
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('FCMToken', token.value);

      const savedToken = localStorage.getItem('FCMToken');
      if (savedToken !== token.value) {
        api
          .registerFcmToken({
            appName,
            body: { token: token.value },
          })
          .subscribe({
            next: () => {
              localStorage.setItem('FCMToken', token.value);
            },
            error: () => {
              console.log('there saves');
            },
          });
      }
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Registration Error:', error);
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('it worked');
        onNotificationReceived?.(notification);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Notification clicked', notification);
      }
    );

    await PushNotifications.register();
  }

  // async initialize(api: any, appName: string) {
  //   const permission = await PushNotifications.requestPermissions();
  //   if (permission.receive !== 'granted') {
  //     return;
  //   }

  //   PushNotifications.addListener(
  //     'pushNotificationReceived',
  //     (notification: PushNotificationSchema) => {
  //       const alert: any = notification;
  //       this.toastr.show(alert?.body);
  //     }
  //   );

  //   PushNotifications.addListener(
  //     'pushNotificationActionPerformed',
  //     (notification: ActionPerformed) => {
  //       console.log('Notification clicked', notification);
  //     }
  //   );
  // }

  // async register(api: any, appName: string) {
  //   const permission = await PushNotifications.requestPermissions();
  //   if (permission.receive !== 'granted') {
  //     return;
  //   }
  //   PushNotifications.addListener('registration', (token: Token) => {
  //     const savedToken = localStorage.getItem('FCMToken');
  //     if (savedToken !== token.value) {
  //     api
  //       .registerFcmToken({
  //         appName,
  //         body: { token: token.value },
  //       })
  //       .subscribe({
  //         next: () => {
  //           localStorage.setItem('FCMToken', token.value);
  //         },
  //         error: () => {
  //           console.log('there saves');
  //         },
  //       });
  //     }
  //   });

  //   PushNotifications.addListener('registrationError', (error) => {
  //     console.error('Registration Error:', error);
  //   });

  //   await PushNotifications.register();
  // }
}
