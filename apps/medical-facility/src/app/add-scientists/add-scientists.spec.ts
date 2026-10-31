import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScientists } from './add-scientists';

describe('AddScientists', () => {
  let component: AddScientists;
  let fixture: ComponentFixture<AddScientists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddScientists]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddScientists);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
