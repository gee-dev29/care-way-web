import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankAccountDetails } from './add-bank-account-details';

describe('AddBankAccountDetails', () => {
  let component: AddBankAccountDetails;
  let fixture: ComponentFixture<AddBankAccountDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBankAccountDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBankAccountDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
