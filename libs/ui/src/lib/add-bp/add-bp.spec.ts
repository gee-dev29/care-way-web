import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBp } from './add-bp';

describe('AddBp', () => {
  let component: AddBp;
  let fixture: ComponentFixture<AddBp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
