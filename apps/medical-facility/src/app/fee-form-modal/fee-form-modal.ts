import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonComponent, InputComponent, Item } from '@healbridge/ui';
import { IonIcon, IonModal, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { v4 } from 'uuid';

@Component({
  selector: 'medical-facility-fee-form-modal',
  imports: [
    ReactiveFormsModule,
    IonModal,
    IonIcon,
    IonText,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './fee-form-modal.html',
  styleUrl: './fee-form-modal.css',
})
export class FeeFormModal implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() title = 'Resend Invitation';
  @Input() saving = false;
  @Input() fee: any = null;

  @Output() dismiss = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form: FormGroup = this.fb.group(
    {
      feeId: [v4()],
      virtualConsultation: [true],
      virtualConsultationFee: [''],
      physicalConsultationFee: ['', [Validators.required, Validators.min(1)]],
      virtualHospitalFee: [''],
      physicalHospitalFee: ['', [Validators.required, Validators.min(1)]],
      virtualConsultationSettlement: ['', Validators.required],
      physicalConsultationSettlement: ['', Validators.required],
    },
    { validators: this.virtualFeesValidator.bind(this) }
  );

  isVirtualSettlement = false;
  isPhysicalSettlement = false;

  settlementOptions: Item[] = [
    { text: 'Hospital Only', value: 'Hospital Only' },
    { text: 'Hospital and Doctor', value: 'Hospital and Doctor' },
  ];

  constructor() {
    addIcons({ 'close-outline': closeOutline });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fee']) {
      this.patchForm(this.fee);
    }
  }

  private patchForm(fee: any) {
    this.form.reset({
      feeId: fee?.feeId ?? v4(),
      virtualConsultation: fee?.virtualConsultation ?? true,
      virtualConsultationFee: fee?.virtualConsultationFee ?? '',
      physicalConsultationFee: fee?.physicalConsultationFee ?? '',
      virtualHospitalFee: fee?.virtualHospitalFee ?? '',
      physicalHospitalFee: fee?.physicalHospitalFee ?? '',
      virtualConsultationSettlement: fee?.virtualConsultationSettlement ?? '',
      physicalConsultationSettlement: fee?.physicalConsultationSettlement ?? '',
    });
  }

  isVirtualSettlementClicked() {
    this.isVirtualSettlement = true;
    this.isPhysicalSettlement = false;
  }

  offVirtualSettlementClicked() {
    this.isVirtualSettlement = false;
  }

  private virtualFeesValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const { virtualConsultation, virtualConsultationFee, virtualHospitalFee } =
      group.value ?? {};

    if (!virtualConsultation) {
      return null;
    }

    const isMissing = (value: unknown) =>
      value === null ||
      value === undefined ||
      value === '' ||
      Number(value) < 1;

    return isMissing(virtualConsultationFee) || isMissing(virtualHospitalFee)
      ? { virtualFeesRequired: true }
      : null;
  }

  isPhysicalSettlementClicked() {
    this.isPhysicalSettlement = true;
    this.isVirtualSettlement = false;
  }

  offPhysicalSettlementClicked() {
    this.isPhysicalSettlement = false;
  }

  onDismiss() {
    this.dismiss.emit();
  }

  onSave() {
    this.save.emit(this.form.value);
  }
}
