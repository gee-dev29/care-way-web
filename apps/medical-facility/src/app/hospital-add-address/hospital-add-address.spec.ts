import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalAddAddress } from './hospital-add-address';

describe('HospitalAddAddress', () => {
  let component: HospitalAddAddress;
  let fixture: ComponentFixture<HospitalAddAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalAddAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalAddAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
