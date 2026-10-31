import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDetails } from './staff-details';

describe('StaffDetails', () => {
  let component: StaffDetails;
  let fixture: ComponentFixture<StaffDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
