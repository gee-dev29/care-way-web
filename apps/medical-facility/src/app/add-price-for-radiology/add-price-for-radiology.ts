import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConversionService,  RadiologyCategory, TestType, } from '@care-way/shared';
import { ButtonComponent, ConfirmationModal, InputComponent, Item } from '@care-way/ui';
import { IonContent, IonIcon, IonText,  } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-add-price-for-radiology',
  imports: [
    IonContent,
        CommonModule,
        IonIcon,
        IonText,
        ButtonComponent,
        InputComponent,
        ReactiveFormsModule,
        FormsModule,
        ConfirmationModal
  ],
  templateUrl: './add-price-for-radiology.html',
  styleUrl: './add-price-for-radiology.css',
})
export class AddPriceForRadiology implements OnInit {
  isCategory = false;
  isTestType = false;
  category: Item[] = [];
  activeTestType: Item[] = [];
  loading = false;
  label = 'Continue';
  open= false;
  private router = inject(Router);
  private conversion = inject(ConversionService);

  ngOnInit(): void {
    this.conversion.convert(RadiologyCategory, this.category);
    this.conversion.convert(TestType, this.activeTestType);


  }

  goBack() {
    this.router.navigateByUrl('/dashboard/radiology-cost-request-details');
  }
  isCategoryClicked() {
    this.isCategory = true;
    this.isTestType = false;
  }
  offCategoryClicked() {
    this.isCategory = false;
  }
  isTestTypeClicked() {
    this.isTestType = true;
    this.isCategory = false;
  }
  offTestTypeClicked() {
    this.isTestType = false;
  }



  next() {
    // this.open = !this.open
    this.router.navigateByUrl('/dashboard/radiology-cost-request-details')
  }
  dismiss(value:boolean){
    this.open = value
  }
  no(){
    this.open = !this.open
  }
  proceed(){
    //
  }


}

