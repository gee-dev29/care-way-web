import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Item } from '../types';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { v4 } from 'uuid';
import { StorageService } from '../storage-service';
import { chevronBackOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonIcon, IonLabel, IonText } from '@ionic/angular/standalone';
import { ButtonComponent } from '../button/button.component';
import { DatePicker } from '../date-picker/date-picker';
import { InputTextarea } from '../input-textarea/input-textarea';
import { TimePicker } from '../time-picker/time-picker';
import { ToastService } from '../toast';
import { InputComponent } from '../input/input';
import { map, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CardType } from '../card-type/card-type';
import { FacilityType, LimitSize } from '../models/action.model';
import moment from 'moment-timezone';
import { ConfirmationModalSecondary } from '../confirmation-modal-secondary/confirmation-modal-secondary';

@Component({
  selector: 'ui-schedule-appointment',
  imports: [
    IonIcon,
    IonText,
    DatePicker,
    TimePicker,
    ReactiveFormsModule,
    InputTextarea,
    ButtonComponent,
    InputComponent,
    CommonModule,
    CardType,
    IonLabel,
    ConfirmationModalSecondary,
  ],
  templateUrl: './schedule-appointment.html',
  styleUrl: './schedule-appointment.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ScheduleAppointment implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private storageService = inject(StorageService);
  private toast = inject(ToastService);
  private formBuilder = inject(FormBuilder);
  @Input() api: any;
  @Input() route: any;
  @Input() conversion: any;
  @Input() limitSize: any;
  @Input() Specialization: any;
  @Input() isMedicalFacility: boolean;
  @Input() symptomId: string | null = null;
  @Input() vitalSign: any;
  date: any;
  time: any;
  @Input() type: any;
  doctors: Item[] = [];
  isAppointmentType = false;
  form: FormGroup;
  isHospital = false;
  rangeOptions: Array<{ label: string; value: number }> = [];
  dateControl = new FormControl(moment().format('YYYY-MM-DD'));
  timeControl = new FormControl(moment().format('HH:mm'));
  specializationControl = new FormControl('', [Validators.required]);
  description = new FormControl('');
  appointmentType = new FormControl('', Validators.required);
  hospital = new FormControl('');
  doctor = new FormControl('');
  requirePatientPayment = new FormControl(true);
  addressControl = new FormControl('');
  memberId: string;
  hospitalId: string;
  address$: Observable<any>;
  doctors$: Observable<any>;
  hospitalSpecializations$: Observable<any>;
  appointmentTypeOptions: any;
  isClicked = false;
  selectedItem: any = [];
  specialization: any = [];
  hospitals$: Observable<any>;
  isSpecialization = false;
  specializationId = null;
  address: any;
  isDoctor = false;
  facilityTypeId: string;
  loading: boolean;
  facilityId: string;
  facilityType: string;
  label = 'REQUEST APPOINTMENT';
  appointmentConfirmationModal = false;
  confirmationMessage: string;

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      specialization: this.specializationControl,
      notes: this.description,
      date: this.dateControl,
      time: this.timeControl,
      appointmentType: this.appointmentType,
      hospital: this.hospital,
      doctor: this.doctor,
      requirePatientPayment: this.requirePatientPayment,
    });
    for (let i = 1; i <= 100; i++) {
      this.rangeOptions.push({
        label: i.toString(),
        value: i,
      });
    }
    this.appointmentTypeOptions = [
      {
        text: this.type.Virtual,
        check: false,
        value: this.type.Virtual,
      },
      {
        text: this.type.Physical,
        check: false,
        value: this.type.Physical,
      },
    ];
    if (this.isMedicalFacility) {
      this.label = 'BOOK APPOINTMENT';
      this.activatedRoute.params.subscribe((params: Params[string]) => {
        this.memberId = params.memberId;
        this.facilityTypeId = params.facilityTypeId;
        this.memberId = params.memberId;
        this.facilityId = params.facilityId;
        this.facilityType = params.facilityType;
        this.getHospitalSpecializations();
        if (params.memberId === null) {
          this.reuse();
        }
      });
    } else {
      this.getHospitalSpecializations();
      this.reuse();
    }
  }

  reuse() {
    this.storageService.user$.subscribe((user) => {
      this.memberId = user;
      this.getMemberVitalSignHistory(this.memberId);
    });
  }

  getMemberVitalSignHistory(memberId: string) {
    return this.api
      .getMemberVitalSignHistory({
        memberId,
        vitalSign: this.vitalSign,
      })
      .subscribe((records: any[]) => {
        const record = records.find(
          (item) => item.vitalRecordId === this.symptomId
        );

        if (record) {
          this.form.patchValue({
            notes: record.description,
          });
        }

        return record;
      });
  }

  getHospitals(specializationId: string) {
    this.hospitals$ = this.api
      .getFacilitiesByType({
        facilityType: FacilityType.Hospital,
        limit: LimitSize.DropDown,
        specializationId,
      })
      .pipe(
        map((response: any) => {
          const allFilterHospital: any = [];
          const filteredHospital = response.data.filter(
            (hospital: any) => hospital.address != null
          );
          filteredHospital.forEach((eachHospital: any) => {
            allFilterHospital.push({
              text: `${eachHospital.name}(${eachHospital.facilityName})`,
              value: eachHospital.hospitalId,
              isChecked: false,
              ...eachHospital,
            });
          });
          return allFilterHospital;
        })
      );
  }

  getHospitalSpecializations() {
    if (this.isMedicalFacility) {
      this.hospitalSpecializations$ = this.api
        .getFacilityTypeById({
          facilityId: this.facilityId,
          facilityTypeId: this.facilityTypeId,
          facilityType: 'Hospital',
        })
        .pipe(
          tap((facility: any) => {
            this.address = facility.address;
          }),
          map((response: any) => {
            const hospitalSpecializations = response.specializations.map(
              (specialization: any) => ({
                text: specialization.name,
                value: specialization.hospitalSpecializationId,
                isChecked: false,
                ...specialization,
              })
            );
            return [
              {
                text: 'Not Sure',
                value: null,
                isChecked: false,
              },
              ...hospitalSpecializations,
            ];
          })
        );
    } else {
      this.hospitalSpecializations$ = this.api
        .getAvailableSpecializations()
        .pipe(
          map((response: any[]) => {
            const hospitalSpecializations = response.map(
              (specialization: any) => ({
                text: specialization.name,
                value: specialization.hospitalSpecializationId,
                isChecked: false,
                ...specialization,
              })
            );
            return [
              {
                text: 'Not Sure',
                value: null,
                isChecked: false,
              },
              ...hospitalSpecializations,
            ];
          })
        );
    }
  }

  getDoctors(specializationId: string | null) {
    this.doctors$ = this.api
      .getProfessionalsInFacilityType({ facilityTypeId: this.facilityTypeId })
      .pipe(
        map((professionalsInFacility: any[]) => {
          const doctorOptions = professionalsInFacility.map((doctor: any) => ({
            text: `${doctor.firstName} ${doctor.lastName}`,
            value: doctor.professionalId,
            isChecked: false,
            group:
              doctor.specializationId === specializationId
                ? 'Available Specialists'
                : 'Other Doctors',
            ...doctor,
          }));
          const specialistsFirst = (a: any, b: any) => {
            const aIsOther = a.group === 'Other Doctors' ? 1 : 0;
            const bIsOther = b.group === 'Other Doctors' ? 1 : 0;
            return aIsOther - bIsOther;
          };
          return doctorOptions.sort(specialistsFirst);
        })
      );
  }

  onSpecializationDropdownItemSelect() {
    this.isSpecialization = true;
  }

  getSpecializationDropdownValue(event: any) {
    this.isSpecialization = false;
    this.specializationId = event.value;
    this.getDoctors(event.value);
    this.getHospitals(event.value);
  }

  onAppointmentTypeDropdownItemSelect() {
    this.isAppointmentType = true;
  }

  getAppointmentTypeDropdownValue() {
    this.isAppointmentType = false;
  }

  onHospitalDropdownItemSelect() {
    this.isHospital = true;
  }

  getHospitalDropdownValue(event: any) {
    this.isHospital = false;
    this.facilityTypeId = event.hospitalId;
    this.getHospital(event.facilityId, event.hospitalId);
  }

  getHospital(facilityId: string, facilityTypeId: string) {
    this.api
      .getFacilityTypeById({
        facilityId: facilityId,
        facilityTypeId: facilityTypeId,
        facilityType: 'Hospital',
      })
      .subscribe((hospital: any) => {
        this.address = hospital.address;
      });
  }

  onDoctorDropdownItemSelect() {
    this.isDoctor = true;
  }

  getDoctorDropdownValue(event: any) {
    this.isDoctor = false;
  }

  continue() {
    if (this.form.invalid) {
      this.toast.show('Please fill all required fields', 'error');
      return;
    }
    const { notes, date, time } = this.form.value;
    const calendarDateTime = moment(
      `${date} ${time}`,
      'YYYY-MM-DD HH:mm'
    ).utc();
    const newDate = calendarDateTime.format('YYYY-MM-DD');
    const newTime = calendarDateTime.format('HH:mm');
    const appointmentId = v4();
    const address =
      this.form.value.appointmentType === this.type.Physical
        ? this.address
        : '';
    const specializationId =
      this.specializationId === 'Not Sure' ? null : this.specializationId;
    const requirePatientPayment =
      this.form.value.appointmentType === this.type.Physical
        ? this.form.value.requirePatientPayment
        : true;
    const facilityTypeId = this.isMedicalFacility
      ? this.facilityTypeId
      : !this.isMedicalFacility && this.type.Physical
      ? this.facilityTypeId
      : null;
    const body = {
      appointmentId,
      memberId: this.memberId,
      date: newDate,
      time: newTime,
      notes,
      appointmentType: this.form.value.appointmentType,
      address,
      specializationId,
      requirePatientPayment,
      facilityTypeId,
      professionalId: this.form.value.doctor?.value ?? null,
      ...(this.symptomId && {
        referencedDocumentId: this.symptomId,
        referenceType: this.vitalSign,
      }),
    };
    this.loading = true;
    this.api
      .bookMedicalAppointment({
        appointmentId,
        body,
      })
      .subscribe({
        next: () => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          this.closeModal();
          setTimeout(() => {
            if (this.isMedicalFacility) {
              if (this.route) {
                this.router.navigateByUrl(this.route);
              } else {
                this.router.navigate([
                  'dashboard/patient-profile',
                  this.facilityType,
                  this.facilityId,
                  this.facilityTypeId,
                  this.memberId,
                ]);
              }
            } else {
              this.router.navigate(['dashboard/appointments', 'Pending']);
            }
          }, 300);
          this.loading = false;
          this.toast.show('Appointment scheduled successfully');
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  closeModal() {
    this.appointmentConfirmationModal = false;
  }

  showAppointmentConfirmation() {
    this.confirmationMessage = `Are you sure you want to request an appointment on ${moment(
      this.form.value.date
    ).format('ddd MMMM D, YYYY')} at ${moment(
      this.form.value.time,
      'HH:mm'
    ).format('h:mm A')}`;
    this.appointmentConfirmationModal = true;
  }

  getAppointmentType(event: any) {
    this.form.patchValue({
      appointmentType: event.value,
    });
  }

  goBack() {
    if (this.route || this.symptomId) {
      this.router.navigateByUrl(this.route);
      if (this.symptomId) {
        this.router.navigateByUrl(
          `dashboard/vitals/symptoms-details/${this.symptomId}/customer`
        );
      }
    } else {
      if (this.isMedicalFacility) {
        this.router.navigate([
          'dashboard/patient-profile',
          this.facilityType,
          this.facilityId,
          this.facilityTypeId,
          this.memberId,
        ]);
      } else {
        this.router.navigateByUrl(`dashboard/appointments`);
      }
    }
  }
}
