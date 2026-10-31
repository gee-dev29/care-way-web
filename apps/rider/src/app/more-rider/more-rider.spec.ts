import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreRider } from './more-rider';

describe('MoreRider', () => {
  let component: MoreRider;
  let fixture: ComponentFixture<MoreRider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreRider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreRider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
