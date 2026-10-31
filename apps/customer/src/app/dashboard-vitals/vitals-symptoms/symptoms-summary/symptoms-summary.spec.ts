import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomsSummary } from './symptoms-summary';

describe('SymptomsSummary', () => {
  let component: SymptomsSummary;
  let fixture: ComponentFixture<SymptomsSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymptomsSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymptomsSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
