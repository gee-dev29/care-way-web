import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacistVideo } from './pharmacist-video';

describe('PharmacistVideo', () => {
  let component: PharmacistVideo;
  let fixture: ComponentFixture<PharmacistVideo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacistVideo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacistVideo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
