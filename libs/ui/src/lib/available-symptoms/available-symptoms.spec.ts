import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableSymptoms } from './available-symptoms';

describe('AvailableSymptoms', () => {
  let component: AvailableSymptoms;
  let fixture: ComponentFixture<AvailableSymptoms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableSymptoms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableSymptoms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
