import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLabTechnician } from './all-lab-technician';

describe('AllLabTechnician', () => {
  let component: AllLabTechnician;
  let fixture: ComponentFixture<AllLabTechnician>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllLabTechnician]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllLabTechnician);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
