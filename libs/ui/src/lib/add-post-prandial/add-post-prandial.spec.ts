import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostPrandial } from './add-post-prandial';

describe('AddPostPrandial', () => {
  let component: AddPostPrandial;
  let fixture: ComponentFixture<AddPostPrandial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPostPrandial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPostPrandial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
