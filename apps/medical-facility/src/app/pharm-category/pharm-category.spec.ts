import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmCategory } from './pharm-category';

describe('PharmCategory', () => {
  let component: PharmCategory;
  let fixture: ComponentFixture<PharmCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
