import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostPrandialVitals } from './add-post-prandial-vitals';

describe('AddPostPrandialVitals', () => {
  let component: AddPostPrandialVitals;
  let fixture: ComponentFixture<AddPostPrandialVitals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPostPrandialVitals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPostPrandialVitals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
