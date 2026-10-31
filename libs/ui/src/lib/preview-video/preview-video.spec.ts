import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewVideo } from './preview-video';

describe('PreviewVideo', () => {
  let component: PreviewVideo;
  let fixture: ComponentFixture<PreviewVideo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewVideo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewVideo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
