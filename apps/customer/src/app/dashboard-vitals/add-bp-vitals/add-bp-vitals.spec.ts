import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBpVitals } from './add-bp-vitals';

describe('AddBpVitals', () => {
  let component: AddBpVitals;
  let fixture: ComponentFixture<AddBpVitals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBpVitals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBpVitals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
