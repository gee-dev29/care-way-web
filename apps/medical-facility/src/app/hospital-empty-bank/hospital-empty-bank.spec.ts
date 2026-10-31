import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalEmptyBank } from './hospital-empty-bank';

describe('HospitalEmptyBank', () => {
  let component: HospitalEmptyBank;
  let fixture: ComponentFixture<HospitalEmptyBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalEmptyBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalEmptyBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
