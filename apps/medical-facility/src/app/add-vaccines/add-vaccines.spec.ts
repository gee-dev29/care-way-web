import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVaccines } from './add-vaccines';

describe('AddVaccines', () => {
  let component: AddVaccines;
  let fixture: ComponentFixture<AddVaccines>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVaccines]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVaccines);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
