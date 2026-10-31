import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryDetalilsCardOne } from './summary-detalils-card-one';

describe('SummaryDetalilsCardOne', () => {
  let component: SummaryDetalilsCardOne;
  let fixture: ComponentFixture<SummaryDetalilsCardOne>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryDetalilsCardOne]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryDetalilsCardOne);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
