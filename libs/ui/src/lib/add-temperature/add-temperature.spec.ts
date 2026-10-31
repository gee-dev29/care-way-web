import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTemperature } from './add-temperature';

describe('AddTemperature', () => {
  let component: AddTemperature;
  let fixture: ComponentFixture<AddTemperature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTemperature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTemperature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
