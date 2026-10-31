import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRandomGlucose } from './add-random-glucose';

describe('AddRandomGlucose', () => {
  let component: AddRandomGlucose;
  let fixture: ComponentFixture<AddRandomGlucose>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRandomGlucose]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRandomGlucose);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
