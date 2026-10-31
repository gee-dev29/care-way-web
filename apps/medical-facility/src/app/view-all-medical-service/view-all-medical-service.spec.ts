import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllMedicalService } from './view-all-medical-service';

describe('ViewAllMedicalService', () => {
  let component: ViewAllMedicalService;
  let fixture: ComponentFixture<ViewAllMedicalService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllMedicalService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllMedicalService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
