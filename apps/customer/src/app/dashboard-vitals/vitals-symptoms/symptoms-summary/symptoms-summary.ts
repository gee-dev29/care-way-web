import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { ButtonComponent } from '@care-way/ui';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonSkeletonText,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, receiptOutline } from 'ionicons/icons';
import moment from 'moment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-symptoms-summary',
  imports: [
    IonContent,
    IonHeader,
    IonIcon,
    IonText,
    ButtonComponent,
    CommonModule,
    IonSkeletonText,
  ],
  templateUrl: './symptoms-summary.html',
  styleUrl: './symptoms-summary.css',
})
export class SymptomsSummary implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  module: string | null = null;
  appointmentId: string;
  symtomsSummary$: Observable<any>;

  constructor() {
    addIcons({
      documentTextOutline,
      receiptOutline,
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
      this.appointmentId = params.appointmentId;
    });
    this.getMedicalAppointment();
  }

  getMedicalAppointment() {
    this.symtomsSummary$ = this.api.getMedicalAppointment({
      appointmentId: this.appointmentId,
    });
  }

  formatDateorTime(dateStr: string) {
    if (!dateStr) return '';

    if (dateStr.includes('-')) {
      return moment(dateStr, 'YYYY-MM-DD').format('MMM D, YYYY');
    }
    return moment(dateStr, 'HH:mm').format('h:mm');
  }

  navigateTo() {
    this.router.navigateByUrl(
      `/dashboard/vitals/schedule-appointments/${this.module}`
    );
  }

  continue() {
    //
  }
}
