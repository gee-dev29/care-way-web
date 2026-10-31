import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyCostRequestDetails } from './radiology-cost-request-details';

describe('RadiologyCostRequestDetails', () => {
  let component: RadiologyCostRequestDetails;
  let fixture: ComponentFixture<RadiologyCostRequestDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiologyCostRequestDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadiologyCostRequestDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
