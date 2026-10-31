import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralItems } from './referral-items';

describe('ReferralItems', () => {
  let component: ReferralItems;
  let fixture: ComponentFixture<ReferralItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
