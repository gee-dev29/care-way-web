import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostprandialVitals } from './add-postprandial-vitals';

describe('AddPostprandialVitals', () => {
  let component: AddPostprandialVitals;
  let fixture: ComponentFixture<AddPostprandialVitals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPostprandialVitals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPostprandialVitals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
