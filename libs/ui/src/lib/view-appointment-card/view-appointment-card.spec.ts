import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppointmentCard } from './view-appointment-card';

describe('ViewAppointmentCard', () => {
  let component: ViewAppointmentCard;
  let fixture: ComponentFixture<ViewAppointmentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAppointmentCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAppointmentCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
