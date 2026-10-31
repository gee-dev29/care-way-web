import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLabTechnician } from './add-lab-technician';

describe('AddLabTechnician', () => {
  let component: AddLabTechnician;
  let fixture: ComponentFixture<AddLabTechnician>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLabTechnician]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLabTechnician);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
