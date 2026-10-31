import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyCostRequestDetails } from './pharmacy-cost-request-details';

describe('PharmacyCostRequestDetails', () => {
  let component: PharmacyCostRequestDetails;
  let fixture: ComponentFixture<PharmacyCostRequestDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyCostRequestDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacyCostRequestDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
