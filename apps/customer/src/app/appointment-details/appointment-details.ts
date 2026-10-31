import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import {
  IonContent,
  IonIcon,
  IonImg,
  IonModal,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  ellipsisVertical,
} from 'ionicons/icons';
import moment from 'moment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-appointment-details',
  imports: [
    IonContent,
    IonIcon,
    IonImg,
    IonModal,
    IonSkeletonText,
    CommonModule,
  ],
  templateUrl: './appointment-details.html',
  styleUrl: './appointment-details.css',
})
export class AppointmentDetails implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  doctorImage = '/images/doctor-img.svg';
  calenderIcon = '/icons/black-calender.svg';
  computerIcon = '/icons/computer-black.svg';
  videoIcon = '/icons/video-icon.svg';
  successModal = false;
  canDismiss = false;

  appointmentDetails$: Observable<any>;
  appointmentId: string;
  @ViewChild('modal') modal: IonModal;
  uploadedDocuments: any;
  viewUploadImage = false;

  followUpRequest = '';

  constructor() {
    addIcons({
      'left-arrow': chevronBackOutline,
      'right-arrow': chevronForwardOutline,
      'dots-vertical': ellipsisVertical,
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.appointmentId = params.appointmentId;
    });

    if (this.appointmentId) {
      this.getMedicalAppointment(this.appointmentId);
      this.uploadedPrescriptions(this.appointmentId);
    }
  }

  getMedicalAppointment(appointmentId: string) {
    this.appointmentDetails$ = this.api.getMedicalAppointment({
      appointmentId: appointmentId,
    });
  }

  uploadedPrescriptions(appointmentId: string) {
    this.api
      .getUploads({
        referencedDocumentId: appointmentId,
      })
      .subscribe((res) => {
        this.uploadedDocuments = res;
      });
  }

  join() {
    this.router.navigateByUrl('consultation-live-video');
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/appointments');
  }

  menu() {
    this.successModal = true;
  }

  routeTo(route: string) {
    this.router.navigate([route]);
    this.modal.dismiss();
  }

  formatDateorTime(dateStr: string) {
    if (!dateStr) return '';

    if (dateStr.includes('-')) {
      return moment(dateStr, 'YYYY-MM-DD').format('MMM D, YYYY');
    }
    return moment(dateStr, 'HH:mm').format('h:mm');
  }

  uploadResult() {
    this.router.navigate(['']);
    this.modal.dismiss();
  }
  viewPrescription() {
    this.router.navigate(['']);
    this.modal.dismiss();
  }
  followUp() {
    this.router.navigate(['']);
    this.modal.dismiss();
  }
  previewVideo() {
    this.router.navigate(['']);
    this.modal.dismiss();
  }
}
