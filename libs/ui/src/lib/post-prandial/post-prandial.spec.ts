import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPrandial } from './post-prandial';

describe('PostPrandial', () => {
  let component: PostPrandial;
  let fixture: ComponentFixture<PostPrandial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPrandial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostPrandial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
