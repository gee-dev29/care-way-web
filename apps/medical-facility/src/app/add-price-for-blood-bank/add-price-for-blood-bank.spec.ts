import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPriceForBloodBank } from './add-price-for-blood-bank';

describe('AddPriceForBloodBank', () => {
  let component: AddPriceForBloodBank;
  let fixture: ComponentFixture<AddPriceForBloodBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPriceForBloodBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPriceForBloodBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
