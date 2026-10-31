import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSymptoms } from './add-symptoms';

describe('AddSymptoms', () => {
  let component: AddSymptoms;
  let fixture: ComponentFixture<AddSymptoms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSymptoms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSymptoms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
