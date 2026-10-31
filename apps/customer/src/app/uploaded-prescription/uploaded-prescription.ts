import { CommonModule, Location } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { ApiService, ReferralType } from '@care-way/api';
import { CostFlow, DocumentStatus } from '@care-way/shared';
import {
  ButtonComponent,
  SafePipe,
  SaveUploadService,
  StorageService,
  ToastService,
  ConfirmationModal,
} from '@care-way/ui';
import {
  IonContent,
  IonIcon,
  IonImg,
  IonModal,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  alertCircleOutline,
  arrowBackCircle,
  arrowBackSharp,
  close,
  closeCircleOutline,
  documentTextOutline,
  imageOutline,
  add,
} from 'ionicons/icons';
import moment from 'moment';
import { map, Observable, switchMap } from 'rxjs';
import { v4 } from 'uuid';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';

interface Prescription {
  id: number;
  image: string;
}

@Component({
  selector: 'app-uploaded-prescription',
  imports: [
    IonContent,
    IonIcon,
    ImageCropperComponent,
    ButtonComponent,
    IonImg,
    IonModal,
    CommonModule,
    SafePipe,
    ConfirmationModal,
  ],
  templateUrl: './uploaded-prescription.html',
  styleUrl: './uploaded-prescription.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UploadedPrescription implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private uploadService = inject(SaveUploadService);
  private modalCtrl = inject(ModalController);
  private location = inject(Location);
  private storageService = inject(StorageService);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastService);
  private imageCompress = inject(NgxImageCompressService);

  @Input() isAddressPresent: boolean;
  @Output() fileUpload = new EventEmitter();
  @Input() address: string;
  @Input() addressObject: string;
  @Input() costFlow = CostFlow;
  @Input() ReferralType = ReferralType;
  @Input() showAddMoreBtn = true;
  @Input() attachments: any;
  @Input() btnLabel = 'Proceed';
  @Input() private api = inject(ApiService);

  safeUrl: SafeResourceUrl;
  referralType: any;
  prescriptions: Prescription[] = [];
  successModal = false;
  canDismiss = false;
  loading = false;
  @Input() isProcessed = false;
  headerTitle: string;
  dataUrl = '';
  DocumentStatus = DocumentStatus;
  file: any;
  fileToBeDeleted: any;
  displayFile = false;
  @ViewChild('modal') modal: IonModal;
  serviceRequestId: string;
  open = false;
  activeTab = null;
  memberId: string;
  confirmationModal = false;
  date = moment().format('YYYY-MM-DD');
  serviceRequest$: Observable<any>;
  moment = moment;

  @ViewChild(ImageCropperComponent) cropper!: ImageCropperComponent;

  croppedImage: string;
  croppedFile?: any;

  constructor() {
    addIcons({
      addCircleOutline,
      add,
      arrowBackSharp,
      documentTextOutline,
      closeCircleOutline,
      arrowBackCircle,
      imageOutline,
      alertCircleOutline,
      close,
    });
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async imageCropped(event: ImageCroppedEvent) {
    if (!event.blob) return;

    const base64 = await this.blobToDataUrl(event.blob);

    const compressed = await this.compressFile(base64, -1);

    this.croppedImage = compressed;
  }

  compressFile(image: any, orientation: any): Promise<string> {
    return this.imageCompress.compressFile(image, orientation, 50, 50);
  }

  load() {
    this.route.params.subscribe((params: any) => {
      this.headerTitle = params.flow;
      this.serviceRequestId = params.serviceRequestId;

      this.storageService.user$.subscribe((user) => {
        this.memberId = user;

        if (this.serviceRequestId) {
          this.serviceRequest$ = this.api
            .getServiceRequest({
              memberId: this.memberId,
              serviceRequestId: this.serviceRequestId,
              referralType: this.selectReferralType(),
            })
            .pipe(
              switchMap((response: any) =>
                this.api
                  .getUploads({
                    referencedDocumentId: response.serviceRequestId,
                  })
                  .pipe(
                    map((uploads: any) => {
                      // response.creator.date = moment(
                      //   response?.creator?.date
                      // ).format('YYYY-MM-DD hh:mm');
                      response.uploads = uploads;
                      return response;
                    })
                  )
              )
            );
        }
      });
    });

    const existing = this.uploadService.upload$.value;
    if (existing) {
      this.prescriptions = existing;
    }

    this.isProcessed = this.router.url.includes(
      `/dashboard/requests/${this.headerTitle}`
    );
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.activeTab) {
        this.activeTab = params.activeTab;
      }
    });
  }

  ngOnInit(): void {
    this.load();
  }

  dismiss(confirmed: boolean) {
    this.modalCtrl.dismiss(confirmed);
  }

  ionViewWillEnter() {
    const existing = this.uploadService.upload$.value;
    if (existing) {
      this.prescriptions = existing;
    }
  }

  showDeleteLabModal(item: any) {
    this.confirmationModal = true;
    this.fileToBeDeleted = item;
  }

  closeDeleteModal() {
    this.confirmationModal = false;
  }
  deleteAttachement() {
    this.api
      .removeFile({
        referencedDocumentId: this.fileToBeDeleted.referencedDocumentId,
        body: { id: this.fileToBeDeleted.uploadId },
      } as any)
      .subscribe({
        next: () => {
          this.confirmationModal = false;
          this.load();
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  addMore() {
    this.open = true;
  }

  goBack() {
    if (this.activeTab != null) {
      this.router.navigateByUrl(
        `/dashboard/requests?activeTab=${this.activeTab}`
      );
    } else {
      this.router.navigateByUrl(`/dashboard/requests`);
    }
  }

  async openModal(text: any) {
    this.loading = true;
    this.btnLabel = 'Please Wait';

    if (text === 'Request Cost') {
      this.api
        .updateServiceRequestStatus({
          serviceRequestId: this.serviceRequestId,
          body: { status: DocumentStatus.Pending },
        } as any)
        .subscribe({
          next: () => {
            this.loading = false;
            this.btnLabel = 'Proceed';
            this.toastr.show('Medical request sent for cost');
            this.router.navigateByUrl(`/dashboard/requests`);
          },
          error: () => {
            this.loading = false;
          },
        });
    } else {
      this.loading = false;
      this.btnLabel = 'Proceed';
      this.router.navigateByUrl(
        `/dashboard/address/${this.headerTitle}/${this.serviceRequestId}`
      );
    }
  }

  selectReferralType() {
    const flow = this.headerTitle;

    switch (flow) {
      case this.costFlow?.PHARMACY:
        this.referralType = this.ReferralType?.Pharmacy;
        break;

      case this.costFlow?.LABTEST:
        this.referralType = this.ReferralType?.Laboratory;
        break;

      case this.costFlow?.RADIOLOGY:
        this.referralType = this.ReferralType?.Radiology;
        break;

      default:
        this.referralType = this.ReferralType?.BloodBank;
        break;
    }

    return this.referralType;
  }

  async choosePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    this.file = image;
    this.openCaptionModal(image.dataUrl);
  }

  async webPathToDataUrl(webPath: string): Promise<string> {
    const response = await fetch(webPath);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async pickFile() {
    const image = await Camera.pickImages({
      quality: 90,
      limit: 1,
    });

    if (image.photos.length > 0) {
      const photo = image.photos[0];
      const dataUrl = await this.webPathToDataUrl(photo.webPath!);

      this.file = {
        dataUrl,
        format: photo.format,
      };

      this.openCaptionModal(dataUrl);
    }
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    this.file = image;
    this.openCaptionModal(image.dataUrl);
  }

  async openCaptionModal(photo: any) {
    this.open = false;
    this.canDismiss = true;

    await this.modal.dismiss(null, 'close');

    this.dataUrl = photo;

    this.canDismiss = false;
    this.displayFile = true;
  }

  async close() {
    this.open = false;
    this.canDismiss = true;

    await this.modal.dismiss(null, 'close');

    this.canDismiss = false;
  }

  async uploadFile() {
    this.loading = true;

    const id = v4();

    this.croppedImage = '';

    this.cropper.crop();

    const start = Date.now();

    while (!this.croppedImage && Date.now() - start < 5000) {
      await new Promise((r) => setTimeout(r, 50));
    }

    const urlToSend = this.croppedImage?.length
      ? this.croppedImage
      : this.dataUrl;

    this.api
      .uploadFile({
        referencedDocumentId: this.serviceRequestId,
        body: {
          id,
          name: `${this.referralType} Medical Request-${id}`,
          url: urlToSend,
        },
      })
      .subscribe({
        next: async () => {
          this.loading = false;
          this.displayFile = false;

          this.canDismiss = true;

          await this.modal.dismiss(null, 'close');

          this.canDismiss = false;

          this.fileUpload.emit(urlToSend);

          this.load();
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  async closeSave() {
    this.displayFile = false;

    this.canDismiss = true;

    await this.modal.dismiss(null, 'close');

    this.canDismiss = false;
  }

  viewAttachment(url: any) {
    this.displayFile = true;
    this.dataUrl = url;

    this.croppedImage = '';
    this.croppedFile = undefined;
  }
}
