import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWeight } from './add-weight';

describe('AddWeight', () => {
  let component: AddWeight;
  let fixture: ComponentFixture<AddWeight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWeight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWeight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
