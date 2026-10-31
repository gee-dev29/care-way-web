import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMedicalFacility } from './create-medical-facility';

describe('CreateMedicalFacility', () => {
  let component: CreateMedicalFacility;
  let fixture: ComponentFixture<CreateMedicalFacility>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMedicalFacility]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMedicalFacility);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
