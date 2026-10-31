import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCard } from './schedule-card';

describe('ScheduleCard', () => {
  let component: ScheduleCard;
  let fixture: ComponentFixture<ScheduleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
