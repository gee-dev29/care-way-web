import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalRecordsCard } from './vital-records-card';

describe('VitalRecordsCard', () => {
  let component: VitalRecordsCard;
  let fixture: ComponentFixture<VitalRecordsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalRecordsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalRecordsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
