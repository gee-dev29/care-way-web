import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAddBank } from './shared-add-bank';

describe('SharedAddBank', () => {
  let component: SharedAddBank;
  let fixture: ComponentFixture<SharedAddBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedAddBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedAddBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
