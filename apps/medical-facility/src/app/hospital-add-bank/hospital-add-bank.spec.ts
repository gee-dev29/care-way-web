import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalAddBank } from './hospital-add-bank';

describe('HospitalAddBank', () => {
  let component: HospitalAddBank;
  let fixture: ComponentFixture<HospitalAddBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalAddBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalAddBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
