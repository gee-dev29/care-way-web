import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService, PinType, ToastService } from '@care-way/shared';
import { ButtonComponent, InputComponent } from '@care-way/ui';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  cameraOutline,
} from 'ionicons/icons';

@Component({
  selector: 'rider-delivery-pin',
  imports: [
    IonContent,
    IonIcon,
    CommonModule,
    FormsModule,
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './delivery-pin.html',
  styleUrl: './delivery-pin.css',
})
export class DeliveryPin {
  router = inject(Router);
  api = inject(ApiService);
  activatedRoute = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastService);
  orderId: string;
  loading = false;
  form: FormGroup;
  fulfilmentPin = new FormControl('', Validators.required);

  constructor() {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      cameraOutline,
    });
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fulfilmentPin: this.fulfilmentPin,
    });

    this.activatedRoute.params.subscribe((params) => {
      this.orderId = params['serviceRequestOrderId'];
    });
  }

  goBack() {
    history.back();
  }

  dispatch() {
    this.loading = true;
    this.api
      .validatePin({
        orderId: this.orderId,
        pinType: PinType.Delivery,
        body: { pin: this.form.value.fulfilmentPin as any },
      })
      .subscribe(
        () => {
          this.toastr.show('Order Delivered Successfully', 'success');
          this.loading = false;
          this.router.navigate(['dashboard/all-orders']);
        },
        () => {
          this.loading = false;
        }
      );
  }
}
