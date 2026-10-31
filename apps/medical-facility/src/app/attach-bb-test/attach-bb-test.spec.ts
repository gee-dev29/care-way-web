import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachBbTest } from './attach-bb-test';

describe('AttachBbTest', () => {
  let component: AttachBbTest;
  let fixture: ComponentFixture<AttachBbTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachBbTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachBbTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
