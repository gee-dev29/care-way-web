import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationLiveVideo } from './consultation-live-video';

describe('ConsultationLiveVideo', () => {
  let component: ConsultationLiveVideo;
  let fixture: ComponentFixture<ConsultationLiveVideo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationLiveVideo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultationLiveVideo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
