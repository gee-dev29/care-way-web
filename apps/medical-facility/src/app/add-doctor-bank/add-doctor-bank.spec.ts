import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoctorBank } from './add-doctor-bank';

describe('AddDoctorBank', () => {
  let component: AddDoctorBank;
  let fixture: ComponentFixture<AddDoctorBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDoctorBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDoctorBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
