import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedEmptyBank } from './shared-empty-bank';

describe('SharedEmptyBank', () => {
  let component: SharedEmptyBank;
  let fixture: ComponentFixture<SharedEmptyBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedEmptyBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedEmptyBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
