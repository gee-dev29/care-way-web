import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderSummary } from './rider-summary';

describe('RiderSummary', () => {
  let component: RiderSummary;
  let fixture: ComponentFixture<RiderSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
