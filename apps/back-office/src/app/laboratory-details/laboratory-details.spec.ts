import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryDetails } from './laboratory-details';

describe('LaboratoryDetails', () => {
  let component: LaboratoryDetails;
  let fixture: ComponentFixture<LaboratoryDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratoryDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboratoryDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
