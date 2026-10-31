import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachementAllRequestLabTest } from './attachement-all-request-lab-test';

describe('AttachementAllRequestLabTest', () => {
  let component: AttachementAllRequestLabTest;
  let fixture: ComponentFixture<AttachementAllRequestLabTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachementAllRequestLabTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachementAllRequestLabTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
