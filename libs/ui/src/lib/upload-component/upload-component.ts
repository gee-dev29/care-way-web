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
import {
  IonIcon,
  IonText,
  IonImg,
  IonModal,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafePipe } from '../safe-pipe';
import { ButtonComponent } from '../button/button.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SaveUploadService } from '../save-upload.service';
import { v4 } from 'uuid';
import { addIcons } from 'ionicons';
import { add, addCircleOutline } from 'ionicons/icons';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import log from 'video.js/dist/types/utils/log';

@Component({
  selector: 'ui-upload-component',
  imports: [
    IonIcon,
    IonText,
    IonImg,
    IonModal,
    IonCard,
    IonCardContent,
    SafePipe,
    ButtonComponent,
    ImageCropperComponent,
  ],
  templateUrl: './upload-component.html',
  styleUrl: './upload-component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UploadComponent implements OnInit {
  private router = inject(Router);
  private uploadService = inject(SaveUploadService);
  @Output() back = new EventEmitter();
  @Output() fileUpload = new EventEmitter();
  open = false;
  canDismiss = false;
  @Input() plus: boolean;
  @Input() label: string;
  @Input() headerTitle: string;
  @Input() referencedDocumentId = '';
  @Input() api: any;
  @Input() name: any;
  @Input() heading = 'Upload';
  @Input() route = '';
  @Input() skipRoute: string;
  loading = false;
  @Input() bgColor: any;
  dataUrl = '';
  file: any;
  displayFile = false;
  @ViewChild('modal') modal: IonModal;
  safeUrl: SafeResourceUrl;
  private sanitizer = inject(DomSanitizer);
  private activatedRoute = inject(ActivatedRoute);
  module: string | null;
  costFlow: string | null;
  didFacilityMissOnboarding = false;
  @ViewChild(ImageCropperComponent) cropper!: ImageCropperComponent;
  private imageCompress = inject(NgxImageCompressService);
  croppedImage: string;
  croppedFile?: any;
  isPdf = false;

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (
          event.url.includes('symptoms') ||
          event.url.includes('prescription')
        ) {
          this.open = true;
        }
      }
    });
    this.activatedRoute.params.subscribe((params) => {
      this.module = params['module'];
    });
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.error) {
        this.didFacilityMissOnboarding = true;
      }
    });
  }

  constructor() {
    addIcons({
      addCircleOutline,
      add,
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

  isRouteSegment(segment: string): boolean {
    const segments = this.router.url.split('/').filter(Boolean);

    return segments.includes(segment);
  }

  upload() {
    this.open = true;
  }
  skip() {
    if (this.didFacilityMissOnboarding) {
      this.router.navigateByUrl('/dashboard/home');
    } else {
      this.router.navigateByUrl(this.skipRoute);
    }
  }

  async choosePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });

    const dataUrl = `data:image/jpeg;base64,${image.base64String}`;

    this.file = {
      dataUrl,
      format: 'jpeg',
    };

    this.openCaptionModal(dataUrl);
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
    const result = await FilePicker.pickFiles({
      readData: true,
      types: ['application/pdf', 'image/*'],
    });

    if (!result.files?.length) {
      return;
    }

    const pickedFile = result.files[0];

    const dataUrl = `data:${pickedFile.mimeType};base64,${pickedFile.data}`;

    this.file = {
      name: pickedFile.name,
      mimeType: pickedFile.mimeType,
      path: pickedFile.path,
      dataUrl,
      size: pickedFile.size,
    };

    this.isPdf = pickedFile.mimeType === 'application/pdf';

    this.openCaptionModal(dataUrl);
  }
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    const dataUrl = `data:image/jpeg;base64,${image.base64String}`;

    this.file = {
      dataUrl,
      format: 'jpeg',
    };

    this.openCaptionModal(dataUrl);
  }

  async openCaptionModal(photo: any) {
    this.open = false;
    this.canDismiss = true;
    await this.modal.dismiss(null, 'close');
    this.dataUrl = photo;
    this.canDismiss = false;
    this.displayFile = true;
  }

  async uploadFile() {
    this.loading = true;
    this.croppedImage = '';

    if (!this.isPdf) {
      this.cropper.crop();
    }

    const start = Date.now();

    while (!this.croppedImage && Date.now() - start < 5000) {
      await new Promise((r) => setTimeout(r, 50));
    }

    const urlToSend = this.croppedImage?.length
      ? this.croppedImage
      : this.dataUrl;

    this.api
      .uploadFile({
        referencedDocumentId: this.referencedDocumentId,
        body: {
          id: v4(),
          name: this.heading,
          url: urlToSend,
        },
      })
      .subscribe({
        next: async () => {
          this.loading = false;
          this.displayFile = false;
          this.canDismiss = true;

          await this.modal.dismiss(null, 'close');

          this.fileUpload.emit(urlToSend);

          if (this.route.includes('prescription')) {
            const currentImages = this.uploadService.upload$.value;

            const newImage = {
              id: currentImages.length + 1,
              image: this.dataUrl,
            };

            this.uploadService.upload$.next([...currentImages, newImage]);

            setTimeout(() => {
              this.router.navigateByUrl(this.route);
            }, 300);
          } else if (this.isRouteSegment('upload-symptoms')) {
            const currentImages = this.uploadService.upload$.value;

            const newImage = {
              id: currentImages.length + 1,
              image: this.dataUrl,
            };

            this.uploadService.upload$.next([...currentImages, newImage]);

            setTimeout(() => {
              this.router.navigateByUrl(this.route);
            }, 300);
          } else if (this.isRouteSegment('symptoms')) {
            const targetRoute = this.module
              ? `/dashboard/vitals/symptoms-details/${this.module}`
              : '/dashboard/vitals/symptoms-details';

            setTimeout(() => {
              this.router.navigateByUrl(targetRoute);
            }, 300);
          } else {
            setTimeout(() => {
              if (this.didFacilityMissOnboarding) {
                this.router.navigateByUrl('/dashboard/home');
              } else {
                this.router.navigateByUrl(this.route);
              }
            }, 300);
          }
        },

        error: () => {
          this.loading = false;
        },
      });
  }

  skipIt() {
    if (this.route.includes('prescription')) {
      this.router.navigateByUrl(this.route);
    } else if (this.isRouteSegment('upload-symptoms')) {
      this.router.navigateByUrl(this.route);
    } else if (this.isRouteSegment('symptoms')) {
      if (this.module) {
        this.router.navigateByUrl(
          '/dashboard/vitals/symptoms-details/' + this.module
        );
        return;
      }
      this.router.navigateByUrl('/dashboard/vitals/symptoms-details');
    } else {
      if (this.didFacilityMissOnboarding) {
        this.router.navigateByUrl('/dashboard/home');
      } else {
        this.router.navigateByUrl(this.route);
      }
    }
  }

  async close() {
    this.open = false;
    this.canDismiss = true;
    await this.modal.dismiss(null, 'close');
    this.canDismiss = false;
  }

  async closeSave() {
    this.displayFile = false;
    this.canDismiss = true;
    await this.modal.dismiss(null, 'close');
    this.canDismiss = false;
  }
}
