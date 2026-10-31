import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralHistory } from './referral-history';

describe('ReferralHistory', () => {
  let component: ReferralHistory;
  let fixture: ComponentFixture<ReferralHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
