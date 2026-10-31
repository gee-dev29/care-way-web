import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDetailsForm } from './bank-details-form';

describe('BankDetailsForm', () => {
  let component: BankDetailsForm;
  let fixture: ComponentFixture<BankDetailsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankDetailsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankDetailsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
