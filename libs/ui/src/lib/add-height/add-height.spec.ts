import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHeight } from './add-height';

describe('AddHeight', () => {
  let component: AddHeight;
  let fixture: ComponentFixture<AddHeight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHeight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHeight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
