import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicalDevices } from './add-medical-devices';

describe('AddMedicalDevices', () => {
  let component: AddMedicalDevices;
  let fixture: ComponentFixture<AddMedicalDevices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMedicalDevices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMedicalDevices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
