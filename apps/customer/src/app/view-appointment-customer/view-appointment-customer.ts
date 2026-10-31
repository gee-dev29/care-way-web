import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
  IonTitle,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  checkmarkCircle,
  closeOutline,
  ellipseOutline,
} from 'ionicons/icons';
import {
  LabTestCard,
  RadImagingCard,
  BloodBankCard,
  PrescriptionCard,
  Item,
  ToastService,
  ConfirmationModal,
  ViewAppointmentCard,
  Vitals,
  StorageService,
  AppointmentRecordingCard,
  DoctorsAppointmentAvailabilityCard,
  ConfirmationModalSecondary,
  CalendarReminder,
} from '@care-way/ui';
import { ConversionService, DocumentStatus } from '@care-way/shared';
import {
  ApiService,
  AppointmentType,
  MedicalAppointmentStatus,
  ProfessionalType,
  ReferralType,
} from '@care-way/api';
import {
  concatMap,
  from,
  map,
  Observable,
  of,
  shareReplay,
  Subject,
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
import moment from 'moment-timezone';

@Component({
  selector: 'app-view-appointment-customer',
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
    IonModal,
    IonModal,
    LabTestCard,
    RadImagingCard,
    BloodBankCard,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ConfirmationModal,
    ViewAppointmentCard,
    Vitals,
    AppointmentRecordingCard,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    DoctorsAppointmentAvailabilityCard,
    ConfirmationModalSecondary,
  ],
  templateUrl: './view-appointment-customer.html',
  styleUrl: './view-appointment-customer.css',
})
export class ViewAppointmentCustomer implements OnInit, OnDestroy {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  private formBulder = inject(FormBuilder);
  private conversion = inject(ConversionService);
  private toastr = inject(ToastService);
  private calenderReminderService = inject(CalendarReminder)
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
  medicalServices: any[] = [];
  showMedicalServiceSection = false;
  showPrescriptionSection = false;
  showLabTestSection = false;
  showDiagnosticSection = false;
  showBloodBankSection = false;
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
  doctor$: Observable<any>;
  appointmentType = AppointmentType;
  appointmentId: string;
  memberId: string;
  professionalId: string;
  private destroy$ = new Subject<void>();
  vitalsOpen = true;
  appointment: any;
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
  vitalItems: any;
  private storageService = inject(StorageService);
  callRecordingModal: boolean;
  recordingUrls$: Observable<any>;
  appointmentConfirmationModal: boolean;
  bookAppointmentModal: boolean;
  acceptedAppointmentRequests$: Observable<any>;
  confirmationMessage: string;
  selectedAppointment: any;
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
    Paid: [MedicalAppointmentStatus.Confirmed],
    Ready: [MedicalAppointmentStatus.Ready],
    Ongoing: [MedicalAppointmentStatus.Ongoing],
    Completed: [
      MedicalAppointmentStatus.Completed,
      MedicalAppointmentStatus.Settled,
    ],
    Cancelled: [
      MedicalAppointmentStatus.CustomerCancelled,
      MedicalAppointmentStatus.HospitalCancelled,
    ],
  };

  constructor() {
    addIcons({
      addCircleOutline,
      closeOutline,
      checkmarkCircle,
      ellipseOutline,
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.appointmentId = params.appointmentId;
        this.load();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load() {
    this.getLabTest();
    this.getRadiologyTest();
    this.getBloodBank();
    this.getMedicalAppointment();
    this.getMedicalServices();
    this.getPrescriptions();
    this.getLabGroups();
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

  getMedicalServices() {
    this.api
      .getAppointmentReferrals({
        appointmentId: this.appointmentId,
        facilityTypeId: this.professionalId,
        referralType: ReferralType.MedicalProduct,
      })
      .subscribe((res: any) => {
        this.medicalServices = res.data ?? [];
        if (this.medicalServices.length > 0)
          this.showMedicalServiceSection = true;
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

  getMedicalAppointment() {
    this.appointment$ = this.api
      .getMedicalAppointment({ appointmentId: this.appointmentId })
      .pipe(
        tap((appointment: any) => {
          this.memberId = appointment.memberId;
          this.appointment = appointment;
          this.professionalId = appointment.professionalId;
          this.address = appointment.address;
          if (appointment?.professionalId) {
            this.getDoctor(appointment.professionalId);
          }
        }),
        map((appointment) => appointment)
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

  goBack() {
    this.router.navigate(['/dashboard/appointments']);
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

  requestCost(referralIds: any[], facilityType: any) {
    this.confirmSend = true;
    this.facilityType = facilityType;
    this.referralIds = referralIds;
    const serviceRequestId = v4();
    this.serviceRequestId = serviceRequestId;
    this.isLoading = true;
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
          this.toastr.show('Cost Request has been sent', 'success');
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

        this.router.navigateByUrl(
          `dashboard/select-address/${this.serviceRequestId}/${this.memberId}/select-address/Patient/professionalSendCost/${this.appointment?.appointmentId}`
        );
      } else {
        this.whoGoes = this.appointment?.facilityTypeId;

        this.router.navigateByUrl(
          `dashboard/select-address/Hospital/${this.serviceRequestId}/${this.memberId}/${this.appointment?.facilityTypeId}/select-address/Hospital/professionalSendCost/${this.appointment?.appointmentId}`
        );
      }
    }, 100);
  }

  joinCall() {
    this.router.navigate([
      'dashboard',
      'appointment-video-call',
      this.appointmentId,
    ]);
  }

  getStatus(status: any): string {
    for (const [label, statuses] of Object.entries(this.statusMap)) {
      if (statuses.includes(status)) {
        return label;
      }
    }
    return 'Pending';
  }

  proceedToPayment(appointment: any) {
    this.router.navigate([
      '/dashboard/payment-summary',
      appointment.appointmentId,
    ]);
  }

  getItems() {
    this.storageService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((memberId: any) => {
        this.memberId = memberId;
        this.vitalItems = [
          {
            title: 'Blood Pressure',
            value$: this.getEachRecord('Blood Pressure', 'value'),
            subtitle$: this.getEachRecord('Blood Pressure', 'subtitle'),
            icon: '/logo/bloodPressure.svg',
            bg: '#E15E49',
          },
          {
            title: 'Temperature',
            value$: this.getEachRecord('Temperature', 'value'),
            subtitle$: this.getEachRecord('Temperature', 'subtitle'),
            icon: '/logo/temperature.svg',
            bg: '#3C4CCB',
          },
          {
            title: 'Glucose Level',
            value$: this.getEachRecord('Glucose', 'value'),
            subtitle$: this.getEachRecord('Glucose', 'subtitle'),
            icon: '/logo/glucoseLevel.svg',
            bg: '#92A3A8',
          },
          {
            title: 'Weight',
            value$: this.getEachRecord('Weight', 'value'),
            icon: '/logo/weight.svg',
            bg: '#7A57C9',
          },
          {
            title: 'Height',
            value$: this.getEachRecord('Height', 'value'),
            icon: '/logo/height.svg',
            bg: '#977F30',
          },
          {
            title: 'Oxygen Saturation',
            value$: this.getEachRecord('Oxygen Saturation', 'value'),
            subtitle$: this.getEachRecord('Pulse', 'subtitle'),
            icon: '/logo/oxygenSaturation.svg',
            bg: '#AC3434',
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
              return line === 'value' ? `${last?.record ?? '--'} ft` : '';
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

  openBookAppointmentModal() {
    this.api
      .getMedicalAppointmentRequests({
        appointmentId: this.appointmentId,
        status: 'Accepted',
      })
      .subscribe((response: any) => {
        this.acceptedAppointmentRequests$ = of(response.data);
        this.bookAppointmentModal = true;
      });
  }

  showAppointmentConfirmation(item: any) {
    this.selectedAppointment = item;
    const localDateTime = moment
      .utc(`${item.date} ${item.time}`, 'YYYY-MM-DD HH:mm')
      .local();
    this.confirmationMessage = `Are you sure you want to book an appointment with Doctor ${
      item.professional.firstName + ' ' + item.professional.lastName
    } on ${localDateTime.format('ddd MMMM D, YYYY')} at ${localDateTime.format(
      'h:mm A'
    )}?`;
    this.appointmentConfirmationModal = true;
    this.bookAppointmentModal = false;
  }

  bookAppointment() {
    const body = {
      professionalId: this.selectedAppointment?.professional.professionalId,
      facilityTypeId: this.selectedAppointment.facilityTypeId,
      date: this.selectedAppointment.date,
      time: this.selectedAppointment.time,
    };
    this.api
      .confirmProfessionalAppointment({
        appointmentId: this.appointmentId,
        body,
      })
      .subscribe({
        next: () => {
          this.appointmentConfirmationModal = false;
          setTimeout(() => {
            this.toastr.show('Appointment booked successfully!');
            this.router.navigate([
              '/dashboard/payment-summary',
              this.appointmentId,
            ]);
          }, 300);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  closeModal() {
    this.appointmentConfirmationModal = false;
    this.bookAppointmentModal = true;
  }
  setReminder(appointment:any){
      const localDateTime = moment
          .utc(`${appointment.date} ${appointment.time}`, 'YYYY-MM-DD HH:mm')
          .local();
        this.calenderReminderService.downloadIcs({
          title: 'Appointment',
          description: `Care-Way Appointment with Doctor ${
            appointment.professionalName
          } on ${localDateTime.format(
            'ddd MMMM D, YYYY'
          )} at ${localDateTime.format('h:mm A')}`,
          date: localDateTime.format('YYYY-MM-DD'),
          time: localDateTime.format('HH:mm'),
          durationMinutes: 30,
          reminderMinutesBefore: [1440, 60, 10],
  })
  }
}
