import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalDetailsCard } from './withdrawal-details-card';

describe('WithdrawalDetailsCard', () => {
  let component: WithdrawalDetailsCard;
  let fixture: ComponentFixture<WithdrawalDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawalDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawalDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
