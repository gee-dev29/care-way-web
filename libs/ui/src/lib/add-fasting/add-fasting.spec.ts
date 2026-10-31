import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFasting } from './add-fasting';

describe('AddFasting', () => {
  let component: AddFasting;
  let fixture: ComponentFixture<AddFasting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFasting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFasting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
