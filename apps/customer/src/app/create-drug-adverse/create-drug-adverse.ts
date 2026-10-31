import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { InputTextarea, ButtonComponent } from '@care-way/ui';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-create-drug-adverse',
  imports: [
    IonContent,
    IonIcon,
    IonText,
    InputTextarea,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './create-drug-adverse.html',
  styleUrl: './create-drug-adverse.css',
})
export class CreateDrugAdverse implements OnInit {
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);
  orderId: any;
  form: FormGroup;
  description = new FormControl('', Validators.required);

  ngOnInit(): void {
    this.form = this.formBuilder.group({ description: this.description });
    this.activatedRoute.params.subscribe((params: any) => {
      this.orderId = params.orderId;
    });
  }
  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
    });
  }

  goBack() {
    this.router.navigate([
      'dashboard/order-details',
      this.orderId,
      'delivered',
    ]);
  }

  save() {
   this.goBack();
  }
}
