import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRandom } from './add-random';

describe('AddRandom', () => {
  let component: AddRandom;
  let fixture: ComponentFixture<AddRandom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRandom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRandom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
