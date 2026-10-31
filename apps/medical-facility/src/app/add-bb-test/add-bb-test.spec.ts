import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBbTest } from './add-bb-test';

describe('AddBbTest', () => {
  let component: AddBbTest;
  let fixture: ComponentFixture<AddBbTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBbTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBbTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
