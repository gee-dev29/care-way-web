import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPrandialCard } from './post-prandial-card';

describe('PostPrandialCard', () => {
  let component: PostPrandialCard;
  let fixture: ComponentFixture<PostPrandialCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPrandialCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostPrandialCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
