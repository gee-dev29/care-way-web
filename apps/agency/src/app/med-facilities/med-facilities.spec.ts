import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedFacilities } from './med-facilities';

describe('MedFacilities', () => {
  let component: MedFacilities;
  let fixture: ComponentFixture<MedFacilities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedFacilities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedFacilities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
