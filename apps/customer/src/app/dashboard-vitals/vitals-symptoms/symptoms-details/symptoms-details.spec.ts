import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomsDetails } from './symptoms-details';

describe('SymptomsDetails', () => {
  let component: SymptomsDetails;
  let fixture: ComponentFixture<SymptomsDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymptomsDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymptomsDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
