import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { ButtonComponent, InputComponent, InputTextarea } from '@care-way/ui';
import {
  IonContent,
  IonIcon,
  IonCard,
  IonCardContent,
  IonImg,
  IonModal,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import moment from 'moment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-prescription-details',
  imports: [
    IonContent,
    IonIcon,
    IonCard,
    IonCardContent,
    IonImg,
    ButtonComponent,
    IonModal,
    InputTextarea,
    CommonModule,
    IonModal,
  ],
  templateUrl: './prescription-details.html',
  styleUrl: './prescription-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrescriptionDetails implements OnInit {
  successModal = false;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  appointmentId: string;
  prescriptionDetails$: Observable<any>;
  uploadedDocuments: any;
  viewUploadImage = false;
  imageView: string;

  constructor() {
    addIcons({
      'left-arrow': chevronBackOutline,
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
    this.prescriptionDetails$ = this.api.getMedicalAppointment({
      appointmentId: appointmentId,
    });
  }

  showUploadedImage(i: any) {
    this.imageView = this.uploadedDocuments[i].url;
    this.viewUploadImage = true;
  }

  requestForCost() {
    this.successModal = true;
  }

  formatDateorTime(dateStr: string) {
    if (!dateStr) return '';

    if (dateStr.includes('-')) {
      return moment(dateStr, 'YYYY-MM-DD').format('MMM D, YYYY');
    }
    return moment(dateStr, 'HH:mm').format('h:mm');
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

  goToSchedule() {
    this.router.navigateByUrl('/dashboard/appointments');
  }

  goToPrescriptionDetails() {
    this.successModal = false;
  }

  goToAppointmentDetails() {
    this.router.navigateByUrl(`/appointment-details/${this.appointmentId}`);
  }
}
