import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPriceForRadiology } from './add-price-for-radiology';

describe('AddPriceForRadiology', () => {
  let component: AddPriceForRadiology;
  let fixture: ComponentFixture<AddPriceForRadiology>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPriceForRadiology]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPriceForRadiology);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
