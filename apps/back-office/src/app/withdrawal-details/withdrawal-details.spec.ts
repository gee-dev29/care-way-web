import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalDetails } from './withdrawal-details';

describe('WithdrawalDetails', () => {
  let component: WithdrawalDetails;
  let fixture: ComponentFixture<WithdrawalDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawalDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawalDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
