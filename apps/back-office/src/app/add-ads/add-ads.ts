import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  DesktopButton,
  DesktopInput,
  FormBody,
  InputDropDownComponent,
  PageBody,
  UploadBox,
  DateInput,
} from '@healbridge/ui';
import { AppNames, ConversionService } from '@healbridge/shared';
import { v4 } from 'uuid';
import { AdvertDevice, ApiService } from '@healbridge/api';
import moment from 'moment';
import { forkJoin, map, Observable, of } from 'rxjs';

@Component({
  selector: 'back-office-add-ads',
  imports: [
    DesktopButton,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    PageBody,
    FormBody,
    DesktopInput,
    InputDropDownComponent,
    UploadBox,
    DateInput,
  ],
  templateUrl: './add-ads.html',
  styleUrl: './add-ads.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddAds implements OnInit {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private conversion = inject(ConversionService);
  api = inject(ApiService);
  toastr = inject(ToastrService);
  activatedRoute = inject(ActivatedRoute);
  loading = false;
  saveLabel = 'Save';
  form: FormGroup;
  advertId = v4();
  isEditMode = false;
  advertDevice = AdvertDevice;
  existingAssets: { device: AdvertDevice; assetUrl: string }[] = [];

  adOwner = new FormControl('', Validators.required);
  destinationUrl = new FormControl('', Validators.required);
  durationDays = new FormControl('', Validators.required);
  audience = new FormControl('', Validators.required);
  startDate = new FormControl('', Validators.required);

  audiences: { key: string; value: string }[] = [];

  mobileLogo: File | null = null;
  tabletLogo: File | null = null;
  desktopLogo: File | null = null;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      adOwner: this.adOwner,
      destinationUrl: this.destinationUrl,
      durationDays: this.durationDays,
      audience: this.audience,
      startDate: this.startDate,
    });

    this.activatedRoute.queryParams.subscribe((params: Params[string]) => {
      if (params.advertId) {
        this.isEditMode = true;
        this.advertId = params.advertId;
        this.form.patchValue({
          ...params,
          durationDays: params.durationInDays,
        });
        this.loadAdvert(this.advertId);
      }
    });
    this.conversion.convert(AppNames, this.audiences);
  }

  loadAdvert(advertId: string) {
    this.api.getAdvert({ advertId }).subscribe({
      next: (advert: any) => {
        this.form.patchValue({
          adOwner: advert.adOwner,
          destinationUrl: advert.destinationUrl,
          durationDays: advert.durationInDays,
          audience: advert.audience,
          startDate: advert.startDate,
        });
        this.existingAssets = advert.assets || [];
      },
    });
  }

  onMobileLogoSelected(file: File) {
    this.validateDimensions(file, 1200, 628, 'Mobile').subscribe((valid) => {
      if (valid) {
        this.mobileLogo = file;
      }
    });
  }

  onTabletLogoSelected(file: File) {
    this.validateDimensions(file, 1600, 900, 'Tablet').subscribe((valid) => {
      if (valid) {
        this.tabletLogo = file;
      }
    });
  }

  onDesktopLogoSelected(file: File) {
    this.validateDimensions(file, 1920, 1080, 'Desktop').subscribe((valid) => {
      if (valid) {
        this.desktopLogo = file;
      }
    });
  }

  onMobileLogoDeleted() {
    this.mobileLogo = null;
    this.existingAssets = this.existingAssets.filter(
      (asset) => asset.device !== AdvertDevice.Mobile
    );
  }

  onTabletLogoDeleted() {
    this.tabletLogo = null;
    this.existingAssets = this.existingAssets.filter(
      (asset) => asset.device !== AdvertDevice.Tablet
    );
  }

  onDesktopLogoDeleted() {
    this.desktopLogo = null;
    this.existingAssets = this.existingAssets.filter(
      (asset) => asset.device !== AdvertDevice.Desktop
    );
  }

  getAsset(device: AdvertDevice) {
    return (
      this.existingAssets.find((a) => a.device === device)?.assetUrl || null
    );
  }

  getAssetName(device: AdvertDevice) {
    const url = this.getAsset(device);
    return url ? url.split('/').pop() : null;
  }

  back() {
    this.router.navigate(['list-all-ads']);
  }

  getImageDimensions(
    file: File
  ): Observable<{ width: number; height: number }> {
    return new Observable((subscriber) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        subscriber.next({ width: img.width, height: img.height });
        subscriber.complete();
        URL.revokeObjectURL(objectUrl);
      };
      img.onerror = (error) => {
        URL.revokeObjectURL(objectUrl);
        subscriber.error(error);
      };
      img.src = objectUrl;
    });
  }

  validateDimensions(
    file: File,
    maxWidth: number,
    maxHeight: number,
    label: string
  ): Observable<boolean> {
    return this.getImageDimensions(file).pipe(
      map(({ width, height }) => {
        if (width > maxWidth || height > maxHeight) {
          this.toastr.error(
            `Max allowed is ${maxWidth} × ${maxHeight}px.`,
            'Image too large'
          );
          return false;
        }
        return true;
      })
    );
  }

  uploadAdFile(file: File) {
    return new Observable((subscriber) => {
      const reader = new FileReader();

      reader.onload = () => {
        const urlToSend = reader.result as string;

        this.api
          .uploadFile({
            referencedDocumentId: this.advertId,
            body: {
              id: v4(),
              name: file.name,
              url: urlToSend,
            },
          })
          .subscribe({
            next: () => {
              this.api
                .getUploads({
                  referencedDocumentId: this.advertId,
                })
                .subscribe({
                  next: (response: any) => {
                    const uploads = response?.data || response || [];

                    const uploadedFile = uploads.find(
                      (item: any) =>
                        item.name === file.name &&
                        item.referencedDocumentId === this.advertId
                    );

                    if (!uploadedFile) {
                      subscriber.error(new Error('Uploaded file not found.'));
                      return;
                    }

                    subscriber.next(
                      uploadedFile?.assetUrl || uploadedFile?.url
                    );

                    subscriber.complete();
                  },
                  error: (error) => subscriber.error(error),
                });
            },
            error: (error) => subscriber.error(error),
          });
      };
      reader.onerror = (error) => subscriber.error(error);
      reader.readAsDataURL(file);
    });
  }

  buildAssets(files: any) {
    const existing = (device: AdvertDevice) =>
      this.existingAssets.find((a) => a.device === device)?.assetUrl;

    const assets: { device: AdvertDevice; assetUrl: string }[] = [];

    const mobileUrl = files.mobile || existing(AdvertDevice.Mobile);
    if (mobileUrl)
      assets.push({ device: AdvertDevice.Mobile, assetUrl: mobileUrl });

    const tabletUrl = files.tablet || existing(AdvertDevice.Tablet);
    if (tabletUrl)
      assets.push({ device: AdvertDevice.Tablet, assetUrl: tabletUrl });

    const desktopUrl = files.desktop || existing(AdvertDevice.Desktop);
    if (desktopUrl)
      assets.push({ device: AdvertDevice.Desktop, assetUrl: desktopUrl });

    return assets;
  }

  save() {
    if (!this.form.valid) return;

    this.loading = true;
    this.saveLabel = 'Please Wait';

    const uploads: any = {};
    if (this.mobileLogo) uploads.mobile = this.uploadAdFile(this.mobileLogo);
    if (this.tabletLogo) uploads.tablet = this.uploadAdFile(this.tabletLogo);
    if (this.desktopLogo) uploads.desktop = this.uploadAdFile(this.desktopLogo);

    if (!this.isEditMode && !Object.keys(uploads).length) {
      this.toastr.error('Please upload at least one image.', 'Image Required');
      this.loading = false;
      this.saveLabel = 'Save';
      return;
    }

    const uploads$ = Object.keys(uploads).length ? forkJoin(uploads) : of({});

    uploads$.subscribe({
      next: (files: any) => {
        const assets = this.buildAssets(files);

        if (!assets.length) {
          this.toastr.error(
            'Please upload at least one image.',
            'Image Required'
          );
          this.loading = false;
          this.saveLabel = 'Save';
          return;
        }

        const payLoad = {
          advertId: this.advertId,
          adOwner: this.form.value.adOwner,
          audience: this.form.value.audience,
          destinationUrl: this.form.value.destinationUrl,
          durationInDays: Number(this.form.value.durationDays),
          startDate: moment(this.form.value.startDate).format('YYYY-MM-DD'),
          assets,
        };

        this.api.createAdvert({ body: payLoad }).subscribe({
          next: () => {
            this.loading = false;
            this.saveLabel = 'Save';
            this.toastr.success(
              this.isEditMode
                ? 'Advert Updated Successfully'
                : 'Advert Created Successfully'
            );
            this.router.navigate(['adds-details', this.advertId]);
          },
          error: () => {
            this.loading = false;
            this.saveLabel = 'Save';
          },
        });
      },
      error: () => {
        this.loading = false;
        this.saveLabel = 'Save';
      },
    });
  }
}
