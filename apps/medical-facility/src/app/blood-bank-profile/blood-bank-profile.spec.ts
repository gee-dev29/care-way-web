import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodBankProfile } from './blood-bank-profile';

describe('BloodBankProfile', () => {
  let component: BloodBankProfile;
  let fixture: ComponentFixture<BloodBankProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodBankProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodBankProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
