import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodBankCostRequestDetails } from './blood-bank-cost-request-details';

describe('BloodBankCostRequestDetails', () => {
  let component: BloodBankCostRequestDetails;
  let fixture: ComponentFixture<BloodBankCostRequestDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodBankCostRequestDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodBankCostRequestDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
