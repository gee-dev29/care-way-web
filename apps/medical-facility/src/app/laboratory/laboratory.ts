import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConversionService, LabCategory, TestName } from '@care-way/shared';
import { ButtonComponent, InputComponent, Item } from '@care-way/ui';
import { IonCard, IonCardContent, IonContent, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';

@Component({
  selector: 'medical-facility-laboratory',
  imports: [
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    ButtonComponent,
    InputComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonSkeletonText,
  ],
  templateUrl: './laboratory.html',
  styleUrl: './laboratory.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Laboratory implements OnInit{
  isCategory = false;
  isTestName = false;
  categories: Item[] = [];
  testNames: Item[] = [];
  loading = false;
  label = 'Save';
  loaded = false;

  private router = inject(Router);
  private conversion = inject(ConversionService);

  ngOnInit(): void {
    this.conversion.convert(LabCategory, this.categories);
    this.conversion.convert(TestName , this.testNames );
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loaded = true;
    }, 3000);
  }
  goBack() {
    this.router.navigateByUrl('dashboard/orders');
  }
  isCategoryClicked() {
    this.isCategory = true;
    this.isTestName = false;
  }
  offCategoryClicked() {
    this.isCategory = false;
  }
  isTestNameClicked() {
    this.isTestName = true;
    this.isCategory = false;
  }
  offTestNameClicked() {
    this.isTestName = false;
  }
  next() {
    this.loading = true;
    this.label = 'Please Wait';
    setTimeout(() => {
      this.label = 'Save';
      this.loading = false;
      this.router.navigateByUrl('/laboratory-details');
    }, 5000);
  }
}
