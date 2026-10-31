import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDetailsCard } from './staff-details-card';

describe('StaffDetailsCard', () => {
  let component: StaffDetailsCard;
  let fixture: ComponentFixture<StaffDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
