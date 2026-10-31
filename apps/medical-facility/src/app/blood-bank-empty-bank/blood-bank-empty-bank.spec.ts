import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodBankEmptyBank } from './blood-bank-empty-bank';

describe('BloodBankEmptyBank', () => {
  let component: BloodBankEmptyBank;
  let fixture: ComponentFixture<BloodBankEmptyBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodBankEmptyBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodBankEmptyBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
