import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllNurses } from './view-all-nurses';

describe('ViewAllNurses', () => {
  let component: ViewAllNurses;
  let fixture: ComponentFixture<ViewAllNurses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllNurses],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAllNurses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
