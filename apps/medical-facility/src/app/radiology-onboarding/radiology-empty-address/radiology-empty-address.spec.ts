import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalEmptyAddress } from './hospital-empty-address';

describe('HospitalEmptyAddress', () => {
  let component: HospitalEmptyAddress;
  let fixture: ComponentFixture<HospitalEmptyAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalEmptyAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalEmptyAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
