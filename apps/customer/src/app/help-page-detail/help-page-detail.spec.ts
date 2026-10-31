import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpPageDetail } from './help-page-detail';

describe('HelpPageDetail', () => {
  let component: HelpPageDetail;
  let fixture: ComponentFixture<HelpPageDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpPageDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpPageDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
