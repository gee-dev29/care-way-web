import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicalService } from './add-medical-service';

describe('AddMedicalService', () => {
  let component: AddMedicalService;
  let fixture: ComponentFixture<AddMedicalService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMedicalService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMedicalService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
