import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodBankCard } from './blood-bank-card';

describe('BloodBankCard', () => {
  let component: BloodBankCard;
  let fixture: ComponentFixture<BloodBankCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodBankCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodBankCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
