import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import {
  ButtonComponent,
  SaveUploadService,
  ConfirmationModal,
  SafePipe,
} from '@care-way/ui';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonContent,
  IonIcon,
  IonImg,
  IonButton,
  ModalController,
  IonText,
  IonModal,
  IonCardContent,
  IonCard,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  arrowBackSharp,
  documentTextOutline,
  closeCircleOutline,
  arrowBackCircle,
  imageOutline,
  alertCircleOutline,
  close,
} from 'ionicons/icons';

@Component({
  selector: 'app-uploaded-symptoms',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonContent,
    IonIcon,
    ButtonComponent,
    IonImg,
    IonButton,
    IonText,
    ConfirmationModal,
    SafePipe,
    IonCardContent,
    IonCard,
    IonModal,
  ],
  templateUrl: './uploaded-symptoms.html',
  styleUrl: './uploaded-symptoms.css',
})
export class UploadedSymptoms implements OnInit {
  private router = inject(Router);
  private api = inject(ApiService);
  private uploadService = inject(SaveUploadService);
  private modalCtrl = inject(ModalController);
  private route = inject(ActivatedRoute);

  btnLabel = 'Proceed';
  prescriptions: any[] = [];
  successModal = false;
  canDismiss = false;
  loading = false;
  bodyId: string;
  module: string;
  confirmationModal = false;
  dataUrl = '';
  displayFile = false;
  @ViewChild('modal') modal: IonModal;

  constructor() {
    addIcons({
      addCircleOutline,
      arrowBackSharp,
      documentTextOutline,
      closeCircleOutline,
      arrowBackCircle,
      imageOutline,
      alertCircleOutline,
      close,
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
      this.bodyId = params.bodyId;
    });

    this.uploadedSymptoms();
  }

  dismiss(confirmed: boolean) {
    this.modalCtrl.dismiss(confirmed);
  }

  uploadedSymptoms() {
    this.api
      .getUploads({
        referencedDocumentId: this.bodyId,
      })
      .subscribe((res) => {
        this.prescriptions = res;
      });
  }
  ionViewWillEnter() {
    this.uploadedSymptoms();

    // const existing = this.uploadService.upload$.value;
    // if (existing) {
    //   this.prescriptions = existing;
    // }
  }

  showDeleteLabModal() {
    this.confirmationModal = true;
  }

  navigateTo() {
    this.router.navigateByUrl(
      `/dashboard/vitals/upload-symptoms/${this.bodyId}/${this.module}`
    );
  }

  async openModal() {
    this.loading = true;
    this.btnLabel = 'Please Wait';
    setTimeout(() => {
      this.btnLabel = 'proceeding..';
      this.loading = false;
      // this.uploadService.upload$.next([]);

      this.router.navigateByUrl(
        `/dashboard/vitals/symptoms-details/${this.bodyId}/${this.module}`
      );
    }, 5000);
  }
  viewAttachment(url: any) {
    this.displayFile = true;
    this.dataUrl = url;
  }
  async closeSave() {
    this.displayFile = false;

    this.canDismiss = true;

    await this.modal.dismiss(null, 'close');

    this.canDismiss = false;
  }
}

interface Symptoms {
  id: number;
  image: string;
}
