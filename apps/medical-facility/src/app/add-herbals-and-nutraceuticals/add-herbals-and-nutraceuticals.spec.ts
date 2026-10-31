import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHerbalsAndNutraceuticals } from './add-herbals-and-nutraceuticals';

describe('AddHerbalsAndNutraceuticals', () => {
  let component: AddHerbalsAndNutraceuticals;
  let fixture: ComponentFixture<AddHerbalsAndNutraceuticals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHerbalsAndNutraceuticals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHerbalsAndNutraceuticals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
