import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonModal,
  IonCard,
  IonText,
  IonCardContent,
  IonImg,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonDatetime,
  IonButton,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  attachOutline,
  cameraOutline,
  chevronBackOutline,
  chevronDown,
  chevronForwardOutline,
  chevronUp,
  close,
  pencilOutline,
  removeCircleOutline,
} from 'ionicons/icons';
import {
  ButtonComponent,
  SafePipe,
  ConfirmationModal,
  ScheduleCard,
  Item,
  InputComponent,
  InputTextarea,
} from '@healbridge/ui';
import {
  forkJoin,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {
  ConversionService,
  DocumentStatus,
  FacilityTypeService,
  Frequency,
  ToastService,
} from '@healbridge/shared';
import { ApiService, FacilityType } from '@healbridge/api';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { NgxImageCompressService } from 'ngx-image-compress';
import { v4 } from 'uuid';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'medical-facility-order-details',
  imports: [
    IonContent,
    IonIcon,
    IonModal,
    IonCard,
    IonText,
    IonCardContent,
    SafePipe,
    ButtonComponent,
    ImageCropperComponent,
    CommonModule,
    FormsModule,
    IonImg,
    ConfirmationModal,
    ScheduleCard,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
    IonDatetime,
    IonButton,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonList,
    InputComponent,
    InputTextarea,
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  viewAttach = false;
  canDismiss = true;
  @ViewChild('modal1') modal1: IonModal;
  @ViewChild('modal2') modal2: IonModal;
  @ViewChild('modal3') modal3: IonModal;
  @ViewChild('modal4') modal4: IonModal;
  @ViewChild('modal7') modal7: IonModal;
  isUploadClicked = false;
  loading = false;
  isCapturing = false;
  facilityType: any;
  fulfilmentId: any;
  dataUrl = '';
  file: any;
  whichIndex: any;
  isRider = false;
  documentStatus = DocumentStatus;
  FacilityType = FacilityType;
  index = 0;
  displayFile = false;
  open = false;
  toastr = inject(ToastService);
  imageView: string;
  api = inject(ApiService);
  moment = moment;
  item: any;
  orderItemId: any;
  addUseText = false;
  private imageCompress = inject(NgxImageCompressService);
  facilityTypeId: any;
  private destroy$ = new Subject<void>();
  @ViewChild(ImageCropperComponent) cropper!: ImageCropperComponent;
  croppedImage: string;
  uploads: any = [];
  rider$: Observable<any>;
  facilityTypeService = inject(FacilityTypeService);
  fulfilment: any;
  expandedIndex: number | null = null;
  resultModal = false;
  drugForm: FormGroup;
  frequency: Item[] = [];
  cycleDurations: any = [];
  label = 'Save';
  tabs = ['Day', 'Month'];
  activeTabIndex = 0;
  memberId: string;
  appointmentId: string;
  professionalId: string;
  referralId: string;
  dayOptions: any = [];
  monthOptions: any = [];
  private editingTimeIndex: number | null = null;
  isStrengthOpen = false;
  availableStrength: any[] = [];
  private conversion = inject(ConversionService);
  private fb = inject(FormBuilder);
  useForUseOrPause = [1];
  payload: any;
  daysOfWeekLength: any = [];
  usage = new FormControl('', Validators.required);
  duration = new FormControl(1, Validators.required);
  durationType = new FormControl('Day', Validators.required);
  scheduleType = new FormControl(null, Validators.required);
  cycleFrequency = new FormControl('Day', Validators.required);
  selectedDay = 0;
  days = [
    { text: 'S', value: 1 },
    { text: 'M', value: 2 },
    { text: 'T', value: 3 },
    { text: 'W', value: 4 },
    { text: 'T', value: 5 },
    { text: 'F', value: 6 },
    { text: 'S', value: 7 },
  ];
  useFor: { unit: number }[] = [];
  times: { time: string; dosage: number }[] = [];
  isTimeModalOpen = false;
  selectedTime = '';
  isUnitModalOpen = false;
  editingUnitIndex: number | null = null;
  pendingUnit = 1;
  fewDaysMedication: any = [];
  weekIndex = null;
  isFrequency = false;
  isUnitPickerOpen = false;
  unitPickerIndex: number | null = null;
  startDate = new FormControl('', [Validators.required]);
  endDate = new FormControl('', [Validators.required]);

  frequencyTypes = [
    { text: 'Daily', value: 'Daily' },
    { text: 'Cycle-Based Schedule', value: 'Cycle-Based Schedule' },
    { text: 'Selected Days of the Week', value: 'Selected Days of the Week' },
    { text: 'At Regular Intervals', value: 'At Regular Intervals' },
    { text: 'As Needed', value: 'As Needed' },
  ];

  unitOptions: any = [];

  selectedFrequency = '';

  @ViewChild('scrollArea') scrollArea!: ElementRef<HTMLDivElement>;
  @ViewChild('previewImg') previewImg!: ElementRef<HTMLImageElement>;

  zoomLevel = 1;
  transformOrigin = 'center center';

  private minZoom = 1;
  private maxZoom = 4;
  private zoomStep = 0.2;

  private startDistance = 0;
  private startZoom = 1;

  constructor() {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      cameraOutline,
      'attach-outline': attachOutline,
      close,
      chevronDown,
      chevronUp,
      removeCircleOutline,
      addCircleOutline,
      pencilOutline,
    });
  }

  reuse() {
    const days: any[] = [];
    for (let index = 0; index < 7; index++) {
      const isSelected = this.daysOfWeekLength.some(
        (week: any) => week.day[index]?.selected === true
      );
      days.push({
        day: index + 1,
        selected: isSelected ? null : false,
      });
    }
    this.daysOfWeekLength.push({
      day: days,
      usages: [],
    });
  }

  load() {
    this.facilityTypeService.facilityType$
      .pipe(
        switchMap(() => this.activatedRoute.params),
        switchMap((params: any) => {
          this.facilityType = params.facilityType;
          this.facilityTypeId = params.facilityTypeId;
          this.fulfilmentId = params.fulfilmentId;

          return this.api.getOrderFulfilment({
            fulfilmentId: this.fulfilmentId,
          });
        }),
        switchMap((response: any) => {
          const rider$ = this.api
            .getServiceRequestOrder({ orderId: response.orderId })
            .pipe(
              takeUntil(this.destroy$),
              switchMap((order: any) => {
                if (order?.riderId) {
                  return this.api.getUser({ userId: order.riderId });
                }
                return of(null);
              })
            );
          const uploadRequests = response.orderItems.map((each: any) =>
            this.api.getUploads({ referencedDocumentId: each.orderItemId })
          );

          return forkJoin({
            rider: rider$,
            uploads: forkJoin(uploadRequests),
          }).pipe(
            map(({ uploads, rider }: any) => {
              response.rider = rider;
              response.orderItems = response.orderItems.map(
                (item: any, index: number) => ({
                  ...item,
                  uploads: uploads[index],
                })
              );

              return response;
            })
          );
        })
      )
      .subscribe((finalResponse) => {
        if (this.facilityType === FacilityType.Pharmacy) {
          finalResponse.orderItems = finalResponse.orderItems.map(
            (item: any) => item
          );
        }

        this.fulfilment = finalResponse;
      });
    // this.facilityTypeService.refresh();
  }

  ngOnInit() {
    this.load();
    for (let index = 0; index < 100; index++) {
      this.cycleDurations.push(index + 1);
      this.unitOptions.push(index + 1);
    }
    for (let index = 2; index < 100; index++) {
      this.fewDaysMedication.push({ key: `Every ${index} Days`, value: index });
    }
    this.conversion.convert(Frequency, this.frequency);
    for (let i = 1; i <= 12; i++) {
      this.monthOptions.push({
        label: i.toString(),
        value: i,
      });
    }
    for (let i = 1; i <= 31; i++) {
      this.dayOptions.push({
        label: i.toString(),
        value: i,
      });
    }
    this.drugForm = this.fb.group({
      duration: this.duration,
      durationType: this.durationType,
      scheduleType: this.scheduleType,
      usage: this.usage,
    });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/orders');
  }

  async closeSave() {
    this.viewAttach = false;
    this.canDismiss = true;
    await this.modal3.dismiss(null, 'close');
    this.canDismiss = false;
    this.isUploadClicked = false;
    this.index = 0;
  }

  showDropDown(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  showUploadedImage(index: any) {
    this.whichIndex = index;
    this.viewAttach = true;
    this.uploads = this.fulfilment?.orderItems[this.whichIndex]?.uploads;
    this.imageView = this.uploads[this.index].url;
  }

  uploadItem(index: any, orderItemId: any) {
    this.whichIndex = index;
    this.orderItemId = orderItemId;
    if (
      this.facilityType !== FacilityType.Pharmacy &&
      this.facilityType !== FacilityType.BloodBank
    ) {
      this.open = true;
    } else {
      if (this.facilityType === FacilityType.BloodBank) {
        this.takePicture();
      } else {
        this.isUploadClicked = true;
      }
    }
  }

  async triggerCamera() {
    await this.modal2.dismiss(null, 'close');
    this.isUploadClicked = false;
    this.takePicture();
  }

  async takePicture() {
    this.isUploadClicked = false;
    this.open = false;
    if (this.isCapturing) return;
    this.isCapturing = true;
    try {
      const image = await Camera.getPhoto({
        quality: 60,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        correctOrientation: true,
      });
      this.file = image;
      setTimeout(() => {
        this.openCaptionModal(this.file.dataUrl);
        this.isCapturing = false;
      }, 100);
    } catch (err) {
      this.isCapturing = false;
    }
  }

  async openCaptionModal(photo: any) {
    this.dataUrl = photo;
    this.displayFile = true;
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

    this.loading = false;
    this.displayFile = false;

    this.canDismiss = true;

    await this.modal1.dismiss(null, 'close');

    this.canDismiss = false;

    this.api
      .uploadFile({
        referencedDocumentId: this.orderItemId,
        body: {
          id,
          name: `${this.facilityType} Fulfilment-${id}`,
          url: urlToSend,
        },
      })
      .subscribe({
        next: async () => {
          this.loading = false;
          this.displayFile = false;

          this.load();
        },
        error: () => {
          this.loading = false;
        },
      });
  }
  next() {
    if (this.index < this.uploads.length - 1) {
      this.index = this.index + 1;
      this.imageView = this.uploads[this.index].url;
    }
  }

  back() {
    if (this.index > 0) {
      this.index = this.index - 1;
      this.imageView = this.uploads[this.index].url;
    }
  }
  proceed() {
    this.loading = true;
    this.api
      .updateOrderFulfilmentStatus({
        fulfilmentId: this.fulfilmentId,
        body: { status: DocumentStatus.Processed },
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.toastr.show('Order processed successfully');
          this.load();
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  check(): any {
    let result = false;
    this.fulfilment?.orderItems?.forEach((each: any) => {
      if (each?.uploads?.length) {
        if (this.facilityType === FacilityType.Pharmacy) {
          if (each?.usage?.length) {
            return (result = true);
          }
          return result;
        } else {
          return (result = true);
        }
      } else {
        return (result = false);
      }
    });
    return result;
  }
  dispatch() {
    if (
      this.facilityType === FacilityType.BloodBank ||
      this.facilityType === FacilityType.Pharmacy
    ) {
      if (this.fulfilment.status === DocumentStatus.Pending) {
        this.api
          .updateOrderFulfilmentStatus({
            fulfilmentId: this.fulfilmentId,
            body: { status: DocumentStatus.Processed },
          })
          .subscribe(() => {
            this.router.navigate([
              'dashboard/confirm-dispatch-pin',
              this.fulfilment.orderId,
              this.fulfilmentId,
              this.facilityType,
              this.facilityTypeId,
            ]);
          });
      } else {
        this.router.navigate([
          'dashboard/confirm-dispatch-pin',
          this.fulfilment.orderId,
          this.fulfilmentId,
          this.facilityType,
          this.facilityTypeId,
        ]);
      }
    } else {
      this.resultModal = true;
    }
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

  async choosePhoto() {
    this.open = false;
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

  async pickFile() {
    this.open = false;
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

  addUse(item: any) {
    this.addUseText = true;
    this.item = item;
  }

  showUploadedAttachment(url: any) {
    this.imageView = url;
    this.viewAttach = true;
  }
  async SaveUse() {
    let allPayload;
    if (this.item.referralType == null) {
      const daysOfWeek =
        this.drugForm?.value?.scheduleType === 'Selected Days of the Week'
          ? this.daysOfWeekLength.flatMap((week: any) =>
              week.day
                .filter((day: any) => day.selected === true)
                .map((day: any) => ({
                  dayOfWeek: day.day,
                  usages: week.usages,
                }))
            )
          : {};
      if (this.drugForm?.value?.scheduleType === 'Selected Days of the Week') {
        this.payload = { dayOfWeek: daysOfWeek };
      } else {
        this.payload = {
          ...this.payload,
          frequency: this.drugForm.value?.cycleFrequency,
        };
      }
      allPayload = {
        ...this.drugForm.value,
        scheduleType: this.payload,
        appointmentId: this.appointmentId,
        memberId: this.memberId,
        referralId: this.referralId,
      };
      this.api
        .updateUsage({
          orderItemId: this.item.orderItemId,
          body: { ...allPayload },
        })
        .subscribe(() => {
          this.addUseText = false;
          this.modal4.dismiss(null, 'close');
          this.canDismiss = false;
          this.load();
        });
    } else {
      this.api
        .updateUsage({
          orderItemId: this.item.orderItemId,
          body: { usage: this.drugForm.value.usage },
        })
        .subscribe(() => {
          this.addUseText = false;
          this.modal4.dismiss(null, 'close');
          this.canDismiss = false;
          this.load();
        });
    }
  }

  async close() {
    this.addUseText = false;
    await this.modal4.dismiss(null, 'close');
    this.canDismiss = false;
  }
  async close2() {
    this.open = false;
    await this.modal7.dismiss(null, 'close');
    this.canDismiss = false;
  }
  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // ngOnDestroy(): void {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }
  setPreview(url: string) {
    this.imageView = url;
    this.zoomLevel = 1;
    this.transformOrigin = 'center center';

    if (this.scrollArea?.nativeElement) {
      this.scrollArea.nativeElement.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  onWheelZoom(event: WheelEvent) {
    event.preventDefault();

    this.updateTransformOrigin(event.clientX, event.clientY);

    if (event.deltaY < 0) {
      this.zoomLevel = Math.min(this.zoomLevel + this.zoomStep, this.maxZoom);
    } else {
      this.zoomLevel = Math.max(this.zoomLevel - this.zoomStep, this.minZoom);
    }
  }

  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 2) {
      this.startDistance = this.getTouchDistance(event.touches);
      this.startZoom = this.zoomLevel;

      const center = this.getTouchCenter(event.touches);
      this.updateTransformOrigin(center.x, center.y);
    }
  }

  onTouchMove(event: TouchEvent) {
    if (event.touches.length === 2) {
      event.preventDefault();

      const currentDistance = this.getTouchDistance(event.touches);
      if (!this.startDistance) return;

      const center = this.getTouchCenter(event.touches);
      this.updateTransformOrigin(center.x, center.y);

      const scaleFactor = currentDistance / this.startDistance;
      const newZoom = this.startZoom * scaleFactor;

      this.zoomLevel = Math.min(Math.max(newZoom, this.minZoom), this.maxZoom);
    }
  }

  onTouchEnd(event: TouchEvent) {
    if (event.touches.length < 2) {
      this.startDistance = 0;
    }
  }

  private getTouchDistance(touches: TouchList): number {
    const touch1 = touches[0];
    const touch2 = touches[1];

    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;

    return Math.sqrt(dx * dx + dy * dy);
  }

  private getTouchCenter(touches: TouchList) {
    const touch1 = touches[0];
    const touch2 = touches[1];

    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  }

  private updateTransformOrigin(clientX: number, clientY: number) {
    if (!this.previewImg?.nativeElement) return;

    const rect = this.previewImg.nativeElement.getBoundingClientRect();

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    this.transformOrigin = `${x}% ${y}%`;
  }

  confirmDispatchResult() {
    this.api
      .updateOrderFulfilmentStatus({
        fulfilmentId: this.fulfilmentId,
        body: { status: DocumentStatus.Dispatched },
      })
      .subscribe(() => {
        this.resultModal = false;
        this.toastr.show('Order Dispatched Successfully', 'success');
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['dashboard/orders']);
        }, 1000);
      });
  }

  closeModal() {
    this.resultModal = false;
  }

  addAnotherWeek() {
    this.times = [];
    this.reuse();
  }

  disableButton() {
    if (this.drugForm.value.scheduleType === 'Selected Days of the Week') {
      return !this.daysOfWeekLength.some(
        (query: any) => query.usages?.[query.usages.length - 1]?.time == null
      );
    } else if (this.drugForm.value.scheduleType === 'As Needed') {
      return true;
    } else {
      return !(
        this.times?.some((query: any) => query.time == null) ||
        this.times.length === 0
      );
    }
  }

  disableNextButton() {
    if (this.drugForm.value.scheduleType == 'Selected Days of the Week') {
      return this.daysOfWeekLength.length == 0;
    } else if (this.drugForm.value.scheduleType == 'Cycle-Based Schedule') {
      return (
        this.payload == null ||
        (this.payload.useFor == null && this.payload.pauseFor == null)
      );
    } else if (this.drugForm.value.scheduleType == 'As Needed') {
      return false;
    } else {
      return this.payload == null;
    }
  }

  onDayChange(event: CustomEvent) {
    if (this.activeTabIndex === 0) {
      this.drugForm.patchValue({
        duration: event.detail.value,
        durationType: 'Day',
      });
    }
  }

  setTab(tab: string) {
    if (tab === 'Day') {
      this.activeTabIndex = 0;
      this.drugForm.patchValue({
        durationType: 'Day',
        duration: 1,
      });
    } else {
      this.activeTabIndex = 1;
      this.drugForm.patchValue({
        durationType: 'Month',
        duration: 1,
      });
    }
  }

  onMonthChange(event: CustomEvent) {
    if (this.activeTabIndex === 1) {
      this.drugForm.patchValue({
        duration: event.detail.value,
        durationType: 'Month',
      });
    }
  }

  isFrequencyClicked() {
    this.isFrequency = true;
  }

  offFrequencyClicked() {
    this.isFrequency = false;
    this.daysOfWeekLength = [];
    this.times = [];
    this.weekIndex = null;
    this.payload = null;
    if (this.drugForm.value.scheduleType != null) {
      switch (this.drugForm.value.scheduleType) {
        case 'Cycle-Based Schedule':
          this.reuse();
          this.drugForm.setControl('cycleFrequency', this.cycleFrequency);
          break;
        default:
          break;
      }
    }
  }

  addTime() {
    this.editingTimeIndex = null;
    this.isTimeModalOpen = true;
    this.selectedTime = moment().format('YYYY-MM-DDTHH:mm:ss');
  }

  addNewTime(weekIndex: any) {
    this.editingTimeIndex = null;
    this.isTimeModalOpen = true;
    this.selectedTime = moment().format('YYYY-MM-DDTHH:mm:ss');
    this.weekIndex = weekIndex;
  }

  selectDay(day: any, weekIndex: number, index: number) {
    const selectedDay = this.daysOfWeekLength[weekIndex].day[index];

    if (selectedDay.selected) {
      this.daysOfWeekLength.forEach((week: any) => {
        if (week.day[index]) {
          week.day[index].selected = false;
        }
      });

      return;
    }

    this.daysOfWeekLength.forEach((week: any, currentWeekIndex: number) => {
      if (week.day[index]) {
        week.day[index].selected = currentWeekIndex === weekIndex ? true : null;
      }
    });
  }

  hasSelectedDay(week: any): boolean {
    return week?.day?.some((item: any) => item.selected === true) ?? false;
  }

  openTimePicker(index: number, weekIndex: any) {
    this.editingTimeIndex = index;
    const current = this.times[index]?.time;
    this.selectedTime = current
      ? moment(current, 'hh:mm A').format('YYYY-MM-DDTHH:mm:ss')
      : moment().format('YYYY-MM-DDTHH:mm:ss');
    this.isTimeModalOpen = true;
    if (weekIndex != null) {
      this.weekIndex = weekIndex;
    }
  }

  unitPickerColumns = [
    {
      name: 'unit',
      options: Array.from({ length: 10 }, (_, i) => ({
        text: String(i + 1),
        value: i + 1,
      })),
    },
  ];

  changeCycleDuration(duration: any, type: string) {
    if (type === 'useFor') {
      this.payload = { ...this.payload, useFor: duration?.detail.value };
    } else {
      this.payload = { ...this.payload, pauseFor: duration?.detail.value };
    }
  }

  changeFewDaysMedication(interval: any) {
    this.payload = { ...this.payload, interval: interval?.detail?.value };
  }

  unitPickerButtons = [
    { text: 'Cancel', role: 'cancel' },
    {
      text: 'Confirm',
      handler: (value: any) => {
        const selected = value?.unit?.value;
        if (this.unitPickerIndex !== null && selected) {
          this.times[this.unitPickerIndex].dosage = selected;
        }
        this.unitPickerIndex = null;
      },
    },
  ];

  onDateTimeChange(time: any) {
    this.selectedTime = time;
  }

  confirmTime() {
    const formatted = moment(this.selectedTime).format('hh:mm');
    if (this.editingTimeIndex !== null) {
      this.times[this.editingTimeIndex].time = formatted;
    } else {
      this.times.push({ time: formatted, dosage: 1 });
    }
    this.isTimeModalOpen = false;
    this.editingTimeIndex = null;
    if (this.weekIndex != null) {
      this.daysOfWeekLength[this.weekIndex].usages = this.times;
    } else {
      this.payload = { ...this.payload, usages: this.times };
    }
  }

  onTimeModalDismiss() {
    this.isTimeModalOpen = false;
    this.editingTimeIndex = null;
  }

  removeTime(index: number, weekIndex: any) {
    this.times.splice(index, 1);
    if (weekIndex != null) {
      this.daysOfWeekLength[weekIndex].usages = this.times;
    } else {
      this.payload = { ...this.payload, usages: this.times };
    }
  }

  openUnitPicker(index: number, weekIndex: any) {
    this.unitPickerIndex = index;
    this.isUnitPickerOpen = true;
    if (weekIndex != null) {
      this.weekIndex = weekIndex;
    }
  }

  confirmUnit(value: any) {
    if (this.unitPickerIndex !== null) {
      this.times[this.unitPickerIndex].dosage = value;
    }
    this.isUnitPickerOpen = false;
    this.unitPickerIndex = null;
    if (this.weekIndex != null) {
      this.daysOfWeekLength[this.weekIndex].usages = this.times;
    } else {
      this.payload = { ...this.payload, usages: this.times };
    }
  }

  changeCycleFrequency(frequency: any) {
    this.payload = { ...this.payload, frequency: frequency.detail?.value };
  }

  onUnitModalDismiss() {
    this.isUnitModalOpen = false;
    this.editingUnitIndex = null;
  }

  setStartDate(date: Date) {
    this.startDate.setValue(moment(date).format('YYYY-MM-DD'));
  }

  setEndDate(date: Date) {
    this.endDate.setValue(moment(date).format('YYYY-MM-DD'));
  }
}
