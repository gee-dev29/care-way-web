import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPrandialVitals } from './post-prandial-vitals';

describe('PostPrandialVitals', () => {
  let component: PostPrandialVitals;
  let fixture: ComponentFixture<PostPrandialVitals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPrandialVitals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostPrandialVitals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
