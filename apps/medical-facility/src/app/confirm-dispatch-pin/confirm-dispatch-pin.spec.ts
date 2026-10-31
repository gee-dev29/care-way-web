import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDispatchPin } from './confirm-dispatch-pin';

describe('ConfirmDispatchPin', () => {
  let component: ConfirmDispatchPin;
  let fixture: ComponentFixture<ConfirmDispatchPin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDispatchPin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDispatchPin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
