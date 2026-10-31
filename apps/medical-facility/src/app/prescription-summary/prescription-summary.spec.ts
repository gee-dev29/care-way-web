import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionSummary } from './prescription-summary';

describe('PrescriptionSummary', () => {
  let component: PrescriptionSummary;
  let fixture: ComponentFixture<PrescriptionSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescriptionSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
