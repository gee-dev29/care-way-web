import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCalendar } from './input-calendar';

describe('InputCalendar', () => {
  let component: InputCalendar;
  let fixture: ComponentFixture<InputCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
