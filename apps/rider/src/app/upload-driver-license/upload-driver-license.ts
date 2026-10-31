import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ApiService } from '@care-way/api';
import { AddNewEntryCard, ButtonComponent, SafePipe } from '@care-way/ui';
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonImg,
  IonModal,
  IonText,
} from '@ionic/angular/standalone';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { v4 } from 'uuid';

@Component({
  selector: 'rider-upload-driver-license',
  imports: [
    AddNewEntryCard,
    ButtonComponent,
    IonCard,
    ImageCropperComponent,
    IonModal,
    IonCardContent,
    IonText,
    IonImg,
    IonText,
    CommonModule,
    SafePipe,
    IonIcon,
  ],
  templateUrl: './upload-driver-license.html',
  styleUrl: './upload-driver-license.css',
})
export class UploadDriverLicense implements OnInit {
  private imageCompress = inject(NgxImageCompressService);
  private api = inject(ApiService);
  private router = inject(Router);
  private activateRoute = inject(ActivatedRoute);
  open = false;
  file: any;
  displayFile = false;
  canDismiss = false;
  loading = false;
  dataUrl = '';
  riderId: any;
  edit = false;
  @ViewChild('modal') modal: IonModal;

  @ViewChild(ImageCropperComponent) cropper!: ImageCropperComponent;

  croppedImage: string;
  croppedFile?: any;

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

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params: any) => {
      this.riderId = params.riderId;
      if (params.edit) {
        this.edit = true;
      }
    });
  }
  skip() {
    if (this.edit) {
      this.router.navigate(['/dashboard/profile', this.riderId]);
    } else {
      this.router.navigate(['/dashboard/summary', this.riderId]);
    }
  }
  openModal() {
    this.open = true;
  }

  back() {
    if (this.edit) {
      this.router.navigate([
        '/dashboard/add-rider-license',
        this.riderId,
        'edit',
      ]);
    } else {
      this.router.navigate(['/dashboard/add-rider-license', this.riderId]);
    }
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

  async openCaptionModal(photo: any) {
    this.open = false;
    this.canDismiss = true;

    await this.modal.dismiss(null, 'close');

    this.dataUrl = photo;

    this.canDismiss = false;
    this.displayFile = true;
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
        referencedDocumentId: this.riderId,
        body: {
          id,
          name: `rider`,
          url: urlToSend,
        },
      })
      .subscribe({
        next: async () => {
          this.displayFile = false;
          this.canDismiss = true;
          this.loading = false;
          await this.modal.dismiss(null, 'close');

          setTimeout(() => {
            this.canDismiss = false;
            if (this.edit) {
              this.router.navigate(['/dashboard/profile', this.riderId]);
            } else {
              this.router.navigate(['/dashboard/summary', this.riderId]);
            }
          }, 300);
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

    setTimeout(() => {
      this.canDismiss = false;
    }, 300);
  }

  viewAttachment(url: any) {
    this.displayFile = true;
    this.dataUrl = url;

    this.croppedImage = '';
    this.croppedFile = undefined;
  }
}
