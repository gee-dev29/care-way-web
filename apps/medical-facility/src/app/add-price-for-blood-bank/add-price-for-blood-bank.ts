import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BloodGroup, BloodProduct } from '@care-way/api';
import { ConversionService, } from '@care-way/shared';
import { ButtonComponent, InputComponent, Item } from '@care-way/ui';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-add-price-for-blood-bank',
  imports: [ IonContent,
        CommonModule,
        IonIcon,
        IonText,
        ButtonComponent,
        InputComponent,
        ReactiveFormsModule,
        FormsModule,],
  templateUrl: './add-price-for-blood-bank.html',
  styleUrl: './add-price-for-blood-bank.css',
})
export class AddPriceForBloodBank implements OnInit {
  isCategory = false;
  bloodType = false;
  isBloodGroup = false;
  category: Item[] = [];
  bloodTypes: Item[] = [];
  loading = false;
  label = 'Continue';
  open= false;
  private router = inject(Router);
  private conversion = inject(ConversionService);

  ngOnInit(): void {
    this.conversion.convert(BloodProduct, this.category);
    this.conversion.convert(BloodGroup, this.bloodTypes);


  }

  goBack() {
    this.router.navigateByUrl('/dashboard/blood-bank-cost-request-details');
  }
  isCategoryClicked() {
    this.isCategory = true;
    this.bloodType = false;
  }
  offCategoryClicked() {
    this.isCategory = false;
  }
  isActiveBloodTypeClicked() {
    this.bloodType= true;
    this.isCategory = false;

  }
  offActiveBloodTypeClicked() {
    this.bloodType= false;
  }



  next() {
    this.open = !this.open
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

