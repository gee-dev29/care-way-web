import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  ApiService,
  AppointmentType,
  FacilityType,
  MedicalAppointmentStatus,
  ProfessionalType,
} from '@healbridge/api';
import { ConversionService } from '@healbridge/shared';
import {
  DesktopButton,
  PageBody,
  Tab,
  MedicalProfessionalDetailsCard,
  MedicalProfessionalHospitalTable,
  AppointmentRequestTable,
  PageHighlight,
  Modal,
  InputComponent,
  MedicalProfessionalFeeTable,
  DesktopInput,
  LimitSize,
} from '@healbridge/ui';
import { IonModal } from '@ionic/angular/standalone';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { v4 } from 'uuid';
import { AppointmentTable } from '../appointment-table/appointment-table';

@Component({
  selector: 'back-office-doctor-details',
  imports: [
    PageBody,
    CommonModule,
    DesktopButton,
    Tab,
    MedicalProfessionalDetailsCard,
    AppointmentRequestTable,
    PageHighlight,
    ReactiveFormsModule,
    Modal,
    InputComponent,
    MedicalProfessionalFeeTable,
    DesktopInput,
    AppointmentTable,
  ],
  templateUrl: './doctor-details.html',
  styleUrl: './doctor-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DoctorDetails implements OnInit {
  api = inject(ApiService);
  router = inject(Router);
  conversion = inject(ConversionService);
  activatedRoute = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  @ViewChild(IonModal) modal!: IonModal;
  doctor$: Observable<any>;
  hospitalProfessionals$: Observable<any>;
  appointments$: Observable<any>;
  appointmentRequests$: Observable<any>;
  medicalProfessionalFees$: Observable<any>;
  activeTab = 0;
  totalRecords = 0;
  isVirtual = false;
  feeModal = false;
  professionalId: string;
  cardHeading = 'Doctor Details';
  doctor: string;
  cadre: string | undefined;
  form: FormGroup;
  hospitalId: string;
  facilityTypeId: string;
  filters: object;
  physicalConsultationFee = new FormControl(null, [Validators.required]);
  virtualConsultationFee = new FormControl(null);
  virtualConsultation = new FormControl(false, [Validators.required]);
  tabs = [
    { title: 'Details', value: 0, content: 'Details' },
    {
      title: 'Appointment Requests',
      value: 1,
      content: 'Appointment Requests',
    },
    { title: 'Appointments', value: 2, content: 'Appointments' },
    { title: 'Hospitals', value: 3, content: 'Hospitals' },
  ];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params[string]) => {
      this.professionalId = params.professionalId;
      this.getDoctor(this.professionalId);
      this.getAllAppointmentRequests(params.appointmentId);
      this.initialiseForm();
      this.getMedicalProfessionalFee();
    });
  }

  initialiseForm() {
    this.form = this.formBuilder.group({
      physicalConsultationFee: this.physicalConsultationFee,
      virtualConsultationFee: this.virtualConsultationFee,
      virtualConsultation: this.virtualConsultation,
    });
  }

  getDoctor(professionalId: string) {
    this.doctor$ = this.api
      .getMedicalProfessional({
        professionalId,
        professionalType: ProfessionalType.Doctor,
      })
      .pipe(
        tap((response: any) => {
          this.doctor = `${response.firstName} ${response.lastName}`;
          this.cadre = response.cadre;
        })
      );
  }

  getAllAppointmentRequests(appointmentId: string) {
    this.appointmentRequests$ = this.api
      .getMedicalAppointmentRequests({
        appointmentId,
        professionalId: this.professionalId,
      })
      .pipe(
        tap((response: any) => {
          this.totalRecords = response.totalRecords;
        }),
        map((response) => response.data)
      );
  }

  showModalFee(hospitalId: any) {
    this.hospitalId = hospitalId;
    this.feeModal = true;
  }

  showVirtual() {
    this.isVirtual = !this.isVirtual;
  }

  saveFee() {
    const body = {
      feeId: v4(),
      facilityTypeId: this.hospitalId,
      professionalId: this.professionalId,
      virtualConsultation: this.form.value.virtualConsultation,
      physicalConsultationFee: Number(this.form.value.physicalConsultationFee),
      virtualConsultationFee: Number(this.form.value.virtualConsultationFee),
    };

    this.api
      .createMedicalProfessionalFee({
        professionalId: this.professionalId,
        body,
      })
      .subscribe(() => {
        this.toastr.success('Medical Professional Fee Created Sucessfully');
        this.feeModal = false;
        this.form.reset();
      });
  }

  getMedicalProfessionalFee() {
    this.medicalProfessionalFees$ = this.api
      .getMedicalProfessionalFee({
        professionalId: this.professionalId,
      })
      .pipe(
        tap((response: any) => (this.totalRecords = response.totalRecords)),
        map((response) => response.data)
      );
  }

  viewDetails(appointmentId: any) {
    this.router.navigate(['appointment-details', appointmentId]);
  }

  viewAppointmentDetails(appointmentId: string) {
    this.router.navigate(['appointment-details', appointmentId]);
  }

  back() {
    this.router.navigate(['list-all-doctors']);
  }
}
