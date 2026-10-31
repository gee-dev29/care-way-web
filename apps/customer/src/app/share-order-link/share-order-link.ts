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
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import {
  ButtonComponent,
  InputComponent,
  ToastService,
  InputTextarea,
  ConfirmationModal,
} from '@care-way/ui';
import {
  IonContent,
  IonIcon,
  IonModal,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { v4 } from 'uuid';

@Component({
  selector: 'app-share-order-link',
  imports: [
    IonIcon,
    IonContent,
    IonIcon,
    IonText,
    ButtonComponent,
    IonIcon,
    CommonModule,
    InputComponent,
    InputTextarea,
    ConfirmationModal,
  ],
  templateUrl: './share-order-link.html',
  styleUrl: './share-order-link.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShareOrderLink implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private alert = inject(ToastService);
  private api = inject(ApiService);
  private formBuilder = inject(FormBuilder);

  memberId: string;
  orderId: string;
  deleteModal = false;
  appointmentId: string;
  form: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  message = new FormControl('', [Validators.required]);
  loading: boolean;

  ngOnInit(): void {
    this.reload();
    this.form = this.formBuilder.group({
      email: this.email,
      message: this.message,
    });
  }
  reload() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.orderId = params.orderId;
      this.appointmentId = params.appointmentId;
    });
  }
  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
    });
  }

  goBack() {
    if (this.appointmentId) {
      this.router.navigateByUrl(
        `/dashboard/payment-summary/${this.appointmentId}`
      );
    } else {
      this.router.navigateByUrl(`dashboard/order-details/${this.orderId}`);
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  sharePaymentLink() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.deleteModal = true;
    }, 1000);
  }

  closeModal() {
    this.deleteModal = false;
  }

  confirmSend() {
    if (this.appointmentId) {
      this.api
        .registerOrderPaymentHelpRequest({
          helpId: v4(),
          body: {
            orderId: this.orderId,
            ...this.form.value,
            orderType: 'Appointment Order',
          },
        })
        .subscribe(() => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          this.deleteModal = false;
          this.alert.show('Help requested successfully', 'success');
          setTimeout(() => {
            this.goBack();
          }, 100);
        });
    } else {
      this.api
        .registerOrderPaymentHelpRequest({
          helpId: v4(),
          body: {
            orderId: this.orderId,
            ...this.form.value,
            orderType: 'Service Request Order',
          },
        })
        .subscribe(() => {
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setValue('');
          });
          this.deleteModal = false;
          this.alert.show('Help requested successfully', 'success');
          setTimeout(() => {
            this.goBack();
          }, 100);
        });
    }
  }
}
