import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButton,
} from '@ionic/angular/standalone';
// import { Vitals } from '../vitals/vitals';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  checkmarkCircle,
  closeOutline,
  closeCircleOutline,
  ellipseOutline,
} from 'ionicons/icons';
import {
  ButtonComponent,
  InputComponent,
  LabTestCard,
  RadImagingCard,
  BloodBankCard,
  PrescriptionCard,
  Item,
  StorageService,
  ToastService,
  ConfirmationModal,
  ViewAppointmentCard,
  Vitals,
  DatetimePicker,
  TimePicker,
  DatePicker,
  CalendarReminder,
} from '@healbridge/ui';
import {
  AppointmentCategory,
  BloodGroup,
  ConversionService,
  DocumentStatus,
  RadiologySpecialization,
  VitalsRefresh,
} from '@healbridge/shared';
import {
  ApiService,
  AppointmentType,
  BloodProduct,
  FacilityType,
  MedicalAppointmentStatus,
  ProfessionalType,
  ReferralType,
  ServiceRequestStatus,
} from '@healbridge/api';
import {
  concatMap,
  finalize,
  forkJoin,
  from,
  map,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
  tap,
  toArray,
} from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { v4 } from 'uuid';
import moment from 'moment';

@Component({
  selector: 'medical-facility-view-appointment',
  imports: [
    IonContent,
    IonIcon,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonAccordionGroup,
    IonAccordion,
    PrescriptionCard,
    Vitals,
    IonModal,
    ButtonComponent,
    IonModal,
    InputComponent,
    ButtonComponent,
    LabTestCard,
    RadImagingCard,
    BloodBankCard,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ConfirmationModal,
    ViewAppointmentCard,
    IonHeader,
    IonToolbar,
    IonButton,
    TimePicker,
    DatePicker,
  ],
  templateUrl: './view-appointment.html',
  styleUrl: './view-appointment.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewAppointment implements OnDestroy, OnInit {
  public router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  private formBuilder = inject(FormBuilder);
  private conversion = inject(ConversionService);
  private toastr = inject(ToastService);
  private calenderReminderService = inject(CalendarReminder);
  @Input() live: boolean;
  modalType: 'lab' | 'rad' | 'blood' | null = null;
  successModal = false;
  label = 'Add';
  confirmationModal = false;
  prescriptionModal = false;
  isServiceName = false;
  canDismiss = false;
  isBloodProduct = false;
  isBloodGroup = false;
  isTestGroup = false;
  isTestName = false;
  bloodProduct: Item[] = [];
  bloodGroup: Item[] = [];
  serviceNames: Item[] = [];
  prescriptionTotal = 0;
  labTestTotal = 0;
  radTotal = 0;
  bloodBankTotal = 0;
  memberDetails: any;
  ageYears: string;
  labForm: FormGroup;
  radForm: FormGroup;
  bloodForm: FormGroup;
  confirmSend = false;
  popUpAddress = false;
  referralIds: any = [];
  labTestName = new FormControl('', [Validators.required]);
  labTestGroup = new FormControl('', [Validators.required]);
  serviceName = new FormControl('', [Validators.required]);
  radServiceName = new FormControl('', [Validators.required]);
  bloodQty = new FormControl('', [Validators.required]);
  bloodType = new FormControl('', [Validators.required]);
  referralId = new FormControl(v4(), [Validators.required]);
  labTests: any;
  isLoading: boolean;
  facilityType: any;
  rads: any;
  bloodBank: any;
  DocumentStatus = DocumentStatus;
  appointmentStatus = MedicalAppointmentStatus;
  vitalItems: any;
  callRecordingModal: boolean;
  recordingUrls$: Observable<any>;
  timeControl = new FormControl('', Validators.required);
  dateControl = new FormControl('', Validators.required);
  categoryList = [
    {
      title: 'Drug',
      checked: false,
    },
    {
      title: 'Vaccines & Biologics',
      checked: false,
    },
    {
      title: 'Medical Devices',
      checked: false,
    },
    {
      title: 'Herbal  & Nutraceuticals',
      checked: false,
    },
  ];

  selectCategoryModal = false;
  selectedAddCategory: string | null = null;
  categoryIcons: Record<string, string> = {
    [AppointmentCategory.MedicalService]: '/icons/medicalService.svg',
    [AppointmentCategory.Prescription]: '/icons/prescription-icon.svg',
    [AppointmentCategory.BloodBank]: '/icons/bloodBankIcon.svg',
    [AppointmentCategory.Diagnostic]: '/icons/radiologyIcon.svg',
    [AppointmentCategory.LabTest]: '/icons/labIcon.svg',
  };
  showPrescriptionSection = false;
  showLabTestSection = false;
  showDiagnosticSection = false;
  showBloodBankSection = false;
  addCategoryOptions: Item[] = [];

  medicalServices: any[] = [];
  selectedMedicalService: any = null;
  confirmDeleteMedicalServiceModal = false;

  appointmentId: string;
  memberId: string;
  professionalId: string;
  private storageService = inject(StorageService);
  private vitalsRefresh = inject(VitalsRefresh);
  private destroy$ = new Subject<void>();
  vitalsOpen = true;
  appointment: any;
  addressSelected: any;
  more = false;
  open = false;
  ReferralType = ReferralType;
  appointment$: Observable<any>;
  member$: Observable<any>;
  drugs: any;
  testGroups: Item[] = [];
  serviceRequestId: any;
  testNames: Item[] = [];
  whoGoes: any;
  address: any;
  followUpModal = false;
  statusMap: Record<string, string[]> = {
    Pending: [
      MedicalAppointmentStatus.Pending,
      MedicalAppointmentStatus.AwaitingHospitalConfirmation,
      MedicalAppointmentStatus.AwaitingDoctorAvailability,
    ],
    Confirmed: [
      MedicalAppointmentStatus.AwaitingCustomerPayment,
      MedicalAppointmentStatus.DoctorAvailable,
    ],
    Ready: [MedicalAppointmentStatus.Ready],
    Ongoing: [MedicalAppointmentStatus.Ongoing],
    Completed: [
      MedicalAppointmentStatus.Completed,
      MedicalAppointmentStatus.Settled,
    ],
    Paid: [MedicalAppointmentStatus.Confirmed],
    Cancelled: [
      MedicalAppointmentStatus.CustomerCancelled,
      MedicalAppointmentStatus.HospitalCancelled,
    ],
  };
  type = AppointmentType;
  facilityId: string;
  facilityTypeId: string;
  doctor$: Observable<any>;
  appointmentPin = new FormControl('', Validators.required);
  appointmentForm: FormGroup;
  loading = false;
  followUpLoading = false;

  constructor() {
    addIcons({
      addCircleOutline,
      closeOutline,
      closeCircleOutline,
      checkmarkCircle,
      ellipseOutline,
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.appointmentId = params.appointmentId;
        this.memberId = params.memberId;
        this.professionalId = params.professionalId;
        this.facilityId = params.facilityId;
        this.facilityTypeId = params.facilityTypeId;
        this.facilityType = params.facilityType;
        this.load();
      });
  }

  ionViewWillEnter(): void {
    this.vitalsRefresh.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load() {
    this.vitalsRefresh.vital$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (!this.appointmentId || !this.memberId) return;
    });
    // this.storageService.setUser(this.memberId);
    this.bloodGroup = [];
    this.bloodProduct = [];
    this.serviceNames = [];
    this.addCategoryOptions = [];
    this.conversion.convert(BloodGroup, this.bloodGroup);
    this.conversion.convert(BloodProduct, this.bloodProduct);
    this.conversion.convert(RadiologySpecialization, this.serviceNames);
    this.conversion.convert(AppointmentCategory, this.addCategoryOptions);
    this.labForm = this.formBuilder.group({
      testName: this.labTestName,
      testGroup: this.labTestGroup,
      referralId: this.referralId,
    });
    this.radForm = this.formBuilder.group({
      serviceName: this.radServiceName,
      referralId: this.referralId,
    });
    this.bloodForm = this.formBuilder.group({
      serviceName: this.serviceName,
      bloodGroup: this.bloodType,
      quantity: this.bloodQty,
      referralId: this.referralId,
    });
    this.appointmentForm = this.formBuilder.group({
      appointmentPin: this.appointmentPin,
    });
    this.getLabTest();
    this.getRadiologyTest();
    this.getBloodBank();
    this.getMedicalAppointment();
    this.getMember();
    this.getPrescriptions();
    this.getLabGroups();
    this.getMedicalServices();
  }

  getMember() {
    this.api.getMember({ memberId: this.memberId }).subscribe((res: any) => {
      this.memberDetails = res;
      const dob = this.memberDetails?.dob;
      this.ageYears = dob ? String(moment().diff(moment(dob), 'years')) : '';
    });
  }

  onPrescriptionCount(count: number) {
    this.prescriptionTotal = count;
  }

  getPrescriptions() {
    this.api
      .getAppointmentReferrals({
        appointmentId: this.appointmentId,
        facilityTypeId: this.professionalId,
        referralType: ReferralType.Pharmacy,
      })
      .subscribe((res: any) => {
        this.drugs = res?.data ?? [];
        this.prescriptionTotal = res.totalRecords;
        if (this.prescriptionTotal > 0) this.showPrescriptionSection = true;
      });
  }

  getLabTest() {
    this.api
      .getAppointmentReferrals({
        appointmentId: this.appointmentId,
        facilityTypeId: this.professionalId,
        referralType: ReferralType.Laboratory,
      })
      .subscribe((res: any) => {
        this.labTests = res.data ?? [];
        this.labTestTotal = res.totalRecords;
        if (this.labTestTotal > 0) this.showLabTestSection = true;
      });
  }

  getBloodBank() {
    this.api
      .getAppointmentReferrals({
        appointmentId: this.appointmentId,
        facilityTypeId: this.professionalId,
        referralType: ReferralType.BloodBank,
      })
      .subscribe((res: any) => {
        this.bloodBank = res.data;
        this.bloodBankTotal = res.totalRecords;
        if (this.bloodBankTotal > 0) this.showBloodBankSection = true;
      });
  }

  getRadiologyTest() {
    this.api
      .getAppointmentReferrals({
        appointmentId: this.appointmentId,
        facilityTypeId: this.professionalId,
        referralType: ReferralType.Radiology,
      })
      .subscribe((res: any) => {
        this.rads = res.data ?? [];
        this.radTotal = res.totalRecords;
        if (this.radTotal > 0) this.showDiagnosticSection = true;
      });
  }

  getMedicalServices() {
    this.api
      .getAppointmentReferrals({
        appointmentId: this.appointmentId,
        facilityTypeId: this.professionalId,
        referralType: ReferralType.MedicalProduct,
      })
      .subscribe((res: any) => {
        this.medicalServices = res.data ?? [];
      });
  }

  getMedicalAppointment() {
    this.appointment$ = this.api
      .getMedicalAppointment({ appointmentId: this.appointmentId })
      .pipe(
        tap((appointment: any) => {
          this.appointment = appointment;
          this.address = appointment.address;
          this.facilityTypeId = appointment.facilityTypeId;
          if (appointment?.professionalId) {
            this.getDoctor(appointment.professionalId);
          }
        }),
        map((res) => res)
      );
  }

  getDoctor(professionalId: string) {
    this.doctor$ = this.api.getMedicalProfessional({
      professionalId: professionalId,
      professionalType: ProfessionalType.Doctor,
    });
  }

  getLabGroups() {
    this.testGroups = [];
    this.api.getLabGroups().subscribe((res: any) => {
      res.forEach((res: any) => {
        this.testGroups.push({ text: res, value: res });
      });
    });
  }

  getLabTests() {
    this.api
      .getLabTests({ testGroup: this.labForm.value.testGroup })
      .subscribe((res: any) => {
        res?.data?.forEach((res: any) => {
          this.testNames.push({ text: res.name, value: res.name });
        });
      });
  }

  showPrescriptionModal() {
    this.categoryList.forEach((item) => (item.checked = false));
    this.prescriptionModal = true;
  }

  closePrescModal() {
    this.prescriptionModal = false;
  }

  get availableCategoryOptions() {
    return this.addCategoryOptions
      .filter((option) => !this.isCategorySectionVisible(option.text))
      .map((option) => ({
        ...option,
        icon: this.categoryIcons[option.text] ?? '',
      }));
  }

  isCategorySectionVisible(category: string): boolean {
    switch (category) {
      case AppointmentCategory.MedicalService:
        return false;
      case AppointmentCategory.Prescription:
        return this.showPrescriptionSection;
      case AppointmentCategory.BloodBank:
        return this.showBloodBankSection;
      case AppointmentCategory.Diagnostic:
        return this.showDiagnosticSection;
      case AppointmentCategory.LabTest:
        return this.showLabTestSection;
      default:
        return false;
    }
  }

  showAddCategoryModal() {
    this.selectedAddCategory = null;
    this.selectCategoryModal = true;
  }

  closeAddCategoryModal() {
    this.selectCategoryModal = false;
  }

  selectAddCategory(category: string) {
    this.selectedAddCategory = category;
    this.proceedAddCategory();
  }

  addMedicalService() {
    if (this.router.url.includes('nurse-dashboard')) {
      this.router.navigate([
        '/nurse-dashboard',
        this.professionalId,
        'nurse-add-medical-service',
        this.facilityTypeId,
        this.appointmentId,
        this.memberId,
      ]);
    } else if (this.professionalId) {
      this.router.navigate([
        '/doctor-dashboard',
        this.professionalId,
        'doctor-add-medical-service',
        this.facilityTypeId,
        this.appointmentId,
        this.memberId,
      ]);
    } else {
      this.router.navigate([
        'dashboard/add-medical-service-appointment',
        this.facilityType,
        this.facilityId,
        this.facilityTypeId,
        this.appointmentId,
        this.memberId,
      ]);
    }
  }

  proceedAddCategory() {
    switch (this.selectedAddCategory) {
      case AppointmentCategory.MedicalService:
        this.closeAddCategoryModal();
        setTimeout(() => this.addMedicalService(), 100);
        break;
      case AppointmentCategory.Prescription:
        this.showPrescriptionModal();
        break;
      case AppointmentCategory.BloodBank:
        this.showBloodModal();
        break;
      case AppointmentCategory.Diagnostic:
        this.showRadModal();
        break;
      case AppointmentCategory.LabTest:
        this.showLabModal();
        break;
      default:
        break;
    }
    this.selectCategoryModal = false;
  }

  category(item: any) {
    item.checked = !item.checked;
    switch (item.title) {
      case 'Drug':
        this.closePrescModal();
        setTimeout(() => {
          if (this.router.url.includes('nurse-dashboard')) {
            this.router.navigate([
              '/nurse-dashboard',
              this.professionalId,
              'nurse-drug-prescription',
              this.appointmentId,
              this.memberId,
            ]);
          } else if (this.professionalId) {
            this.router.navigate([
              '/doctor-dashboard',
              this.professionalId,
              'doctor-drug-prescription',
              this.appointmentId,
              this.memberId,
            ]);
          } else {
            this.router.navigate([
              'dashboard/add-drug',
              this.facilityType,
              this.facilityId,
              this.facilityTypeId,
              this.appointmentId,
              this.memberId,
            ]);
          }
        }, 100);
        break;
      case 'Vaccines & Biologics':
        this.closePrescModal();
        setTimeout(() => {
          if (this.router.url.includes('nurse-dashboard')) {
            this.router.navigate([
              '/nurse-dashboard',
              this.professionalId,
              'nurse-vaccines-prescription',
              this.appointmentId,
              this.memberId,
            ]);
          } else if (this.professionalId) {
            this.router.navigate([
              '/doctor-dashboard',
              this.professionalId,
              'doctor-vaccines-prescription',
              this.appointmentId,
              this.memberId,
            ]);
          } else {
            this.router.navigate([
              'dashboard/add-vaccines',
              this.facilityType,
              this.facilityId,
              this.facilityTypeId,
              this.appointmentId,
              this.memberId,
            ]);
          }
        }, 100);
        break;
      case 'Medical Devices':
        this.closePrescModal();
        setTimeout(() => {
          if (this.router.url.includes('nurse-dashboard')) {
            this.router.navigate([
              '/nurse-dashboard',
              this.professionalId,
              'add-medical-devices',
              this.appointmentId,
              this.memberId,
            ]);
          } else if (this.professionalId) {
            this.router.navigate([
              '/doctor-dashboard',
              this.professionalId,
              'add-medical-devices',
              this.appointmentId,
              this.memberId,
            ]);
          } else {
            this.router.navigate([
              'dashboard/add-medical-devices',
              this.facilityType,
              this.facilityId,
              this.facilityTypeId,
              this.appointmentId,
              this.memberId,
            ]);
          }
        }, 100);
        break;
      case 'Herbal  & Nutraceuticals':
        this.closePrescModal();
        setTimeout(() => {
          if (this.router.url.includes('nurse-dashboard')) {
            this.router.navigate([
              '/nurse-dashboard',
              this.professionalId,
              'add-herbals-and-nutraceuticals',
              this.appointmentId,
              this.memberId,
            ]);
          } else if (this.professionalId) {
            this.router.navigate([
              '/doctor-dashboard',
              this.professionalId,
              'add-herbals-and-nutraceuticals',
              this.appointmentId,
              this.memberId,
            ]);
          } else {
            this.router.navigate([
              'dashboard/add-herbals-and-nutraceuticals',
              this.facilityType,
              this.facilityId,
              this.facilityTypeId,
              this.appointmentId,
              this.memberId,
            ]);
          }
        }, 100);
        break;
    }
  }

  isServiceNameClicked() {
    this.isServiceName = true;
  }

  offServiceNameClicked() {
    this.isServiceName = false;
  }

  isTestGroupClicked() {
    this.isTestGroup = true;
  }

  offtestGroupClicked() {
    this.isTestGroup = false;
    this.getLabTests();
  }

  isTestNameClicked() {
    this.isTestName = true;
  }

  offtestNameClicked() {
    this.isTestName = false;
  }

  showEditLabModal(lab: any) {
    this.resetDropDownModal();
    this.modalType = 'lab';
    this.successModal = true;
    this.label = 'Update';
    this.labForm.patchValue({
      ...lab,
    });
  }

  showDeleteLabModal() {
    this.confirmationModal = true;
  }

  showDeleteBloodModal(blood: any) {
    this.confirmationModal = true;
  }

  showEditBloodModal(blood: any) {
    this.resetDropDownModal();
    this.modalType = 'blood';
    this.successModal = true;
    this.label = 'Update';
    this.bloodForm.patchValue({
      ...blood,
    });
  }

  showDeleteRadModal() {
    this.confirmationModal = true;
  }

  showEditRadModal(rad: any) {
    this.modalType = 'rad';
    this.successModal = true;
    this.label = 'Update';
    this.radForm.patchValue(rad);
  }

  showDeleteMedicalServiceModal(product: any) {
    this.selectedMedicalService = product;
    this.confirmDeleteMedicalServiceModal = true;
  }

  get hasDraftMedicalServices(): boolean {
    return this.medicalServices.some(
      (product: any) => product.status === DocumentStatus.Draft
    );
  }

  requestMedicalServiceCost() {
    const draftProducts = this.medicalServices.filter(
      (product: any) => product.status === DocumentStatus.Draft
    );
    const referralIds = draftProducts.map((product: any) => product.referralId);
    const costings = draftProducts.map((product: any) => ({
      costingId: v4(),
      product,
    }));
    const serviceRequestId = v4();
    const orderId = v4();
    this.serviceRequestId = serviceRequestId;
    this.isLoading = true;

    this.api
      .createServiceRequest({
        memberId: this.memberId,
        serviceRequestId,
        referralType: ReferralType.MedicalProduct,
        body: { referralIds },
      } as any)
      .pipe(
        concatMap(() =>
          this.api.connectServiceRequestToFacilityTypes({
            serviceRequestId,
            body: { facilityTypeIds: [this.facilityTypeId] },
          } as any)
        ),
        concatMap(() =>
          this.api.addServiceRequestAddress({
            serviceRequestId,
            body: this.address,
          } as any)
        ),
        concatMap(() =>
          this.api.setServiceRequestFacilityTypeAddress({
            serviceRequestId,
            facilityTypeId: this.facilityTypeId,
            body: this.address,
          } as any)
        ),
        concatMap(() =>
          from(costings).pipe(
            concatMap(({ costingId, product }: any) =>
              this.api.createCostEntryForServiceRequest({
                serviceRequestId,
                facilityTypeId: this.facilityTypeId,
                costingId,
                body: {
                  productName: product.productName,
                  productType: product.productType,
                  quantity: Number(product.quantity),
                  requiresDelivery: product.requiresDelivery,
                  unitPrice: Number(product.unitPrice),
                  cost: Number(product.unitPrice) * Number(product.quantity),
                },
              } as any)
            ),
            toArray()
          )
        ),
        concatMap(() =>
          this.api.updateServiceRequestFacilityStatus({
            serviceRequestId,
            facilityTypeId: this.facilityTypeId,
            body: { status: ServiceRequestStatus.Accepted },
          } as any)
        ),
        concatMap(() =>
          this.api.updateServiceRequestStatus({
            serviceRequestId,
            body: { status: ServiceRequestStatus.Processed },
          } as any)
        ),
        concatMap(() =>
          this.api.createServiceRequestOrder({
            orderId,
            body: {
              serviceRequestId,
              costingIds: costings.map(({ costingId }: any) => costingId),
            },
          } as any)
        ),
        concatMap(() =>
          from(referralIds || []).pipe(
            concatMap((referralId: any) =>
              this.api.updateAppointmentReferralStatus({
                appointmentId: this.appointmentId,
                referralId,
                referralType: ReferralType.MedicalProduct,
                body: { status: 'Service Request Created' },
              } as any)
            ),
            toArray()
          )
        )
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.show('Cost Request has been sent', 'success');
          this.getMedicalServices();
        },
        error: () => {
          this.isLoading = false;
          this.toastr.show('unable to request cost', 'error');
        },
      });
  }

  cancelDeleteMedicalServiceModal() {
    this.confirmDeleteMedicalServiceModal = false;
    this.selectedMedicalService = null;
  }

  editMedicalService(product: any) {
    if (this.router.url.includes('nurse-dashboard')) {
      this.router.navigate([
        '/nurse-dashboard',
        this.professionalId,
        'nurse-edit-medical-service',
        this.facilityTypeId,
        product.referralId,
      ]);
    } else if (this.professionalId) {
      this.router.navigate([
        '/doctor-dashboard',
        this.professionalId,
        'doctor-edit-medical-service',
        this.facilityTypeId,
        product.referralId,
      ]);
    } else {
      this.router.navigate([
        'dashboard/edit-medical-service-appointment',
        this.facilityType,
        this.facilityId,
        this.facilityTypeId,
        product.referralId,
      ]);
    }
  }

  deleteLabForm() {
    this.confirmationModal = false;
  }

  deleteMedicalService() {
    this.api
      .deleteAppointmentReferral({
        appointmentId: this.appointmentId,
        referralId: this.selectedMedicalService.referralId,
        referralType: ReferralType.MedicalProduct,
      })
      .subscribe({
        next: () => {
          this.medicalServices = this.medicalServices.filter(
            (product) => product !== this.selectedMedicalService
          );
          this.selectedMedicalService = null;
          this.confirmDeleteMedicalServiceModal = false;
        },
        error: () => {
          this.confirmDeleteMedicalServiceModal = false;
        },
      });
  }

  resetForm() {
    this.labForm?.reset({
      testName: null,
      testGroup: null,
      referralId: v4(),
    });
    this.radForm?.reset({
      serviceName: null,
      referralId: v4(),
    });
    this.bloodForm.reset({
      serviceName: null,
      bloodGroup: null,
      quantity: null,
      referralId: v4(),
    });
    this.label = 'Add';
    this.resetDropDownModal();
  }

  goBack() {
    if (this.router.url.includes('nurse-dashboard')) {
      this.router.navigate(
        ['/nurse-dashboard', this.professionalId, 'nurse-appointments'],
        {
          queryParams: {
            tab: 'Paid',
          },
        }
      );
    } else if (this.professionalId) {
      this.router.navigate(
        [
          '/doctor-dashboard',
          this.professionalId,
          'doctor-available-appointments',
        ],
        {
          queryParams: {
            tab: 'Confirmed',
          },
        }
      );
    } else {
      this.router.navigate([
        'dashboard/list-all-medical-facility-appointments',
        this.facilityType,
        this.facilityId,
        this.facilityTypeId,
        'Pending',
      ]);
    }
  }

  openMore() {
    this.more = !this.more;
  }

  openComplain() {
    this.more = !this.more;
    this.open = !this.open;
  }

  dismiss() {
    this.open = false;
  }

  save() {
    this.open = false;
  }

  resetDropDownModal() {
    this.isBloodGroup = false;
    this.isBloodProduct = false;
  }

  showLabModal() {
    this.resetForm();
    this.modalType = 'lab';
    this.successModal = true;
  }

  showBloodModal() {
    this.resetForm();
    this.modalType = 'blood';
    this.successModal = true;
    this.resetDropDownModal();
  }

  showRadModal() {
    this.resetForm();
    this.modalType = 'rad';
    this.successModal = true;
  }

  closeLabModal() {
    this.api
      .addAppointmentReferral({
        appointmentId: this.appointmentId,
        referralId: this.labForm.value.referralId,
        referralType: ReferralType.Laboratory,
        body: {
          ...this.labForm.value,
          appointmentId: this.appointmentId,
          memberId: this.memberId,
        },
      })
      .subscribe((res) => {
        this.successModal = false;
        this.getLabTest();
      });
  }

  closeRadModal() {
    this.api
      .addAppointmentReferral({
        appointmentId: this.appointmentId,
        referralId: this.radForm.value.referralId,
        referralType: ReferralType.Radiology,
        body: {
          ...this.radForm.value,
          appointmentId: this.appointmentId,
          memberId: this.memberId,
        },
      })
      .subscribe((res) => {
        this.successModal = false;
        this.getRadiologyTest();
      });
  }

  closeBloodModal() {
    this.api
      .addAppointmentReferral({
        appointmentId: this.appointmentId,
        referralId: this.bloodForm.value.referralId,
        referralType: ReferralType.BloodBank,
        body: {
          ...this.bloodForm.value,
          appointmentId: this.appointmentId,
          memberId: this.memberId,
        },
      })
      .subscribe((res) => {
        this.successModal = false;
        this.getBloodBank();
      });
  }

  cancelModal() {
    this.confirmationModal = false;
  }

  isBloodClicked() {
    this.isBloodGroup = true;
    this.isBloodProduct = false;
  }

  isProductClicked() {
    this.isBloodProduct = true;
    this.isBloodGroup = false;
  }

  requestCost(referralIds: any[], facilityType: any) {
    this.confirmSend = true;
    this.referralIds = referralIds;
    const serviceRequestId = v4();
    this.serviceRequestId = serviceRequestId;
    this.isLoading = true;
    this.facilityType = facilityType;
    this.api
      .createServiceRequest({
        memberId: this.memberId,
        serviceRequestId,
        referralType: facilityType,
        body: { referralIds },
      } as any)
      .pipe(
        concatMap(() =>
          from(referralIds || []).pipe(
            concatMap((referralId: any) =>
              this.api.updateAppointmentReferralStatus({
                appointmentId: this.appointmentId,
                referralId,
                referralType: facilityType,
                body: { status: 'Service Request Created' },
              } as any)
            ),
            toArray()
          )
        ),
        concatMap(() =>
          this.api.updateServiceRequestStatus({
            serviceRequestId,
            body: {
              status: 'Pending',
            },
          } as any)
        )
      )
      .subscribe({
        next: () => {
          // this.toastr.show('Cost Request has been sent', 'success');
          this.isLoading = false;
          this.confirmSend = true;
        },
        error: (err: any) => {
          this.isLoading = false;
          this.toastr.show('unable to request cost', 'error');
        },
      });
  }

  sendCost(who: any) {
    this.confirmSend = false;
    setTimeout(() => {
      if (who === 'Patient') {
        this.whoGoes = this.appointment?.memberId;
        if (
          this.appointment?.professionalId &&
          this.router.url.includes('doctor-dashboard')
        ) {
          this.router.navigateByUrl(
            `doctor-dashboard/${this.appointment?.professionalId}/select-address/${this.facilityType}/${this.serviceRequestId}/${this.memberId}/${this.appointment?.facilityTypeId}/select-address/${this.appointment?.professionalId}/Patient/professionalSendCost/${this.appointment?.appointmentId}`
          );
        } else {
          this.router.navigateByUrl(
            `dashboard/select-address/${this.facilityType}/${this.serviceRequestId}/${this.memberId}/${this.appointment?.facilityTypeId}/select-address/Patient/professionalSendCost/${this.appointment?.appointmentId}/${this.facilityId}`
          );
        }
      } else {
        this.api
          .getFacilityType({
            facilityType: FacilityType.Hospital,
            facilityTypeId: this.facilityTypeId,
          })
          .subscribe((res: any) => {
            this.continue(res.address);
          });
      }
    }, 100);
  }

  continue(addressSelected: any) {
    this.addressSelected = addressSelected;
    this.finishSendCost();
  }

  finishSendCost() {
    this.api
      .addServiceRequestAddress({
        serviceRequestId: this.serviceRequestId,
        body: this.addressSelected,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.confirmSend = false;
          this.load();
          this.toastr.show(
            'Cost Request has been sent successfully',
            'success'
          );
        },
        error: () => {
          this.loading = false;
          this.toastr.show('Failed to send cost request', 'error');
        },
      });
  }

  getStatus(status: any): string {
    for (const [label, statuses] of Object.entries(this.statusMap)) {
      if (statuses.includes(status)) {
        return label;
      }
    }
    return 'Pending';
  }

  joinCall() {
    this.router.navigate([
      'doctor-dashboard',
      this.professionalId,
      'appointment-video-call-doctor',
      this.appointmentId,
    ]);
  }

  assignDoctor() {
    if (this.router.url.includes('nurse-dashboard')) {
      this.router.navigate([
        '/nurse-dashboard',
        this.professionalId,
        'assign-doctor-to-appointment',
        this.facilityTypeId,
        this.appointmentId,
        this.memberId,
      ]);
      return;
    }
    this.router.navigate([
      'dashboard/assign-doctor-to-appointment',
      this.facilityType,
      this.facilityId,
      this.facilityTypeId,
      this.appointmentId,
      this.memberId,
    ]);
  }

  getItems() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        const professionalDashboard = this.router.url.includes(
          'nurse-dashboard'
        )
          ? 'nurse-dashboard'
          : 'doctor-dashboard';
        const buildUrl = (segment: string) =>
          this.professionalId
            ? `${professionalDashboard}/${params.professionalId}/${segment}/${params.appointmentId}/${params.memberId}`
            : `dashboard/${segment}/${params.facilityType}/${params.facilityId}/${params.facilityTypeId}/${params.appointmentId}/${params.memberId}`;

        this.vitalItems = [
          {
            title: 'Blood Pressure',
            value$: this.getEachRecord('Blood Pressure', 'value'),
            subtitle$: this.getEachRecord('Blood Pressure', 'subtitle'),
            icon: '/logo/bloodPressure.svg',
            bg: '#E15E49',
            url: buildUrl('add-bp'),
          },
          {
            title: 'Temperature',
            value$: this.getEachRecord('Temperature', 'value'),
            subtitle$: this.getEachRecord('Temperature', 'subtitle'),
            icon: '/logo/temperature.svg',
            bg: '#3C4CCB',
            url: buildUrl('add-temperature'),
          },
          {
            title: 'Glucose Level',
            value$: this.getEachRecord('Glucose', 'value'),
            subtitle$: this.getEachRecord('Glucose', 'subtitle'),
            icon: '/logo/glucoseLevel.svg',
            bg: '#92A3A8',
            url: buildUrl('glucose-type'),
          },
          {
            title: 'Weight',
            value$: this.getEachRecord('Weight', 'value'),
            icon: '/logo/weight.svg',
            bg: '#7A57C9',
            url: buildUrl('add-weight'),
          },
          {
            title: 'Height',
            value$: this.getEachRecord('Height', 'value'),
            icon: '/logo/height.svg',
            bg: '#977F30',
            url: buildUrl('add-height'),
          },
          {
            title: 'Oxygen Saturation',
            value$: this.getEachRecord('Oxygen Saturation', 'value'),
            subtitle$: this.getEachRecord('Pulse', 'subtitle'),
            icon: '/logo/oxygenSaturation.svg',
            bg: '#AC3434',
            url: buildUrl('add-oxygen-saturation'),
          },
        ];
      });
  }

  getEachRecord(vital: string, line: 'value' | 'subtitle') {
    return this.api
      .getMemberVitalSignHistory({
        memberId: this.memberId,
        referencedDocumentId: this.appointmentId,
        vitalSign: vital as any,
      })
      .pipe(
        map((response: any[]) => {
          if (!response?.length) return line === 'value' ? 'No record yet' : '';
          const last = response[0];
          switch (vital) {
            case 'Blood Pressure':
              return line === 'value'
                ? `Systolic: ${last?.systolic ?? '--'}`
                : `Diastolic: ${last?.diastolic ?? '--'}`;
            case 'Temperature':
              return line === 'value'
                ? `Body Area: ${last?.measurementSite ?? '--'}`
                : `Celsius: ${last?.record ?? '--'}°C`;
            case 'Glucose': {
              const r = last?.readings?.[0];
              if (!r) return line === 'value' ? 'No record yet' : '';
              return line === 'value'
                ? `${r.testingType}: ${r.record}`
                : `${r.status ?? ''}`;
            }
            case 'Weight':
              return line === 'value' ? `${last?.record ?? '--'} kg` : '';
            case 'Height':
              return line === 'value' ? `${last?.record ?? '--'} m` : '';
            case 'Oxygen Saturation':
              return `spO₂: ${last?.record ?? '--'}`;
            case 'Pulse':
              return `Pulse: ${last?.record ?? '--'}`;
            default:
              return line === 'value' ? 'No record yet' : '';
          }
        }),
        shareReplay(1)
      );
  }

  navigate(url: any) {
    this.router.navigateByUrl(url);
  }

  openCallRecordingModal() {
    this.api
      .getStreamByReferencedDocumentId({
        referencedDocumentId: this.appointmentId,
      })
      .subscribe((stream: any) => {
        this.recordingUrls$ = this.api.recordingPlaylistUrls({
          streamId: stream.id,
        });
        this.callRecordingModal = true;
      });
  }

  verifyPin() {
    this.loading = true;
    this.api
      .validateAppointmentPin({
        appointmentId: this.appointmentId,
        body: { appointmentPin: this.appointmentForm.value.appointmentPin },
      })
      .subscribe({
        next: (res: any) => {
          this.toastr.show('Appointment pin verified successfully', 'success');
          this.loading = false;
          this.getMedicalAppointment();
        },
        error: (err: any) => {
          this.loading = false;
          this.toastr.show(
            'Invalid appointment pin, please try again',
            'error'
          );
        },
      });
  }

  followUpRequest() {
    this.followUpModal = true;
  }

  setUpRequest() {
    const selectedDate = this.dateControl.value;
    const selectedTime = this.timeControl.value;
    if (!selectedDate || !selectedTime) {
      this.toastr.show('Set date & time', 'error');
      return;
    }
    const appointment = {};
    this.followUpLoading = true;
    this.appointment$
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        const appointment = {
          ...response,
          date: moment(selectedDate).format('YYYY-MM-DD'),
          time: moment(selectedTime).format('HH:mm'),
        };
        this.api
          .bookFollowUpAppointment({
            appointmentId: this.appointmentId,
            body: appointment,
          })
          .subscribe({
            next: (res: any) => {
              this.followUpLoading = false;
              this.followUpModal = false;
              this.toastr.show(
                'Follow-up appointment booked successfully',
                'success'
              );
            },
            error: (err: any) => {
              this.followUpLoading = false;
              this.toastr.show('Failed to book follow-up appointment', 'error');
            },
          });
      });
  }
  setReminder(appointment: any) {
    const localDateTime = moment
      .utc(`${appointment.date} ${appointment.time}`, 'YYYY-MM-DD HH:mm')
      .local();

    const address = appointment.address
      ? [
          appointment.address.address,
          appointment.address.city,
          appointment.address.state,
          appointment.address.postCode,
        ]
          .filter(Boolean)
          .join(', ')
      : '';

    this.calenderReminderService.downloadIcs({
      title: 'Appointment',
      description: `HealBridge ${
        appointment.appointmentType
      } Appointment with ${appointment.memberName} on ${localDateTime.format(
        'ddd MMMM D, YYYY'
      )} at ${localDateTime.format('h:mm A')}${
        appointment.appointmentType === 'Physical'
          ? `. Location: ${address}`
          : ''
      }`,
      date: localDateTime.format('YYYY-MM-DD'),
      time: localDateTime.format('HH:mm'),
      durationMinutes: 30,
      reminderMinutesBefore: [1440, 60, 10],
    });
  }
}
