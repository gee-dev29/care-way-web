import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRadiologyTest } from './add-radiology-test';

describe('AddRadiologyTest', () => {
  let component: AddRadiologyTest;
  let fixture: ComponentFixture<AddRadiologyTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRadiologyTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRadiologyTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
