import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonList,
  IonText,
  IonToggle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-notification-settings',
  imports: [IonContent, IonIcon, IonText, IonList, IonToggle,FormsModule,ReactiveFormsModule],
  templateUrl: './notification-settings.html',
  styleUrl: './notification-settings.css',
})
export class NotificationSettings implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      messages: [true],
      testResults: [false],
      bookingUpdates: [true],
      medicationReminders: [false],
      appointmentReminders: [true],
      newPrescription: [false],
    });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/profile');
  }

  save() {
    console.log('Notification settings:', this.form.value);
  }
}
