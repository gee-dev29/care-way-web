import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenBookMedicalDevices } from './green-book-medical-devices';

describe('GreenBookMedicalDevices', () => {
  let component: GreenBookMedicalDevices;
  let fixture: ComponentFixture<GreenBookMedicalDevices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreenBookMedicalDevices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenBookMedicalDevices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
