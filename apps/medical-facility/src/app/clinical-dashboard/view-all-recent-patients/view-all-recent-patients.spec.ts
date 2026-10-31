import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllRecentPatients } from './view-all-recent-patients';

describe('ViewAllRecentPatients', () => {
  let component: ViewAllRecentPatients;
  let fixture: ComponentFixture<ViewAllRecentPatients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllRecentPatients]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllRecentPatients);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
