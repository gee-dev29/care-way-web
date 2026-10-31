import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodBankDetails } from './blood-bank-details';

describe('BloodBankDetails', () => {
  let component: BloodBankDetails;
  let fixture: ComponentFixture<BloodBankDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodBankDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodBankDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
