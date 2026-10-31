import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseHome } from './nurse-home';

describe('NurseHome', () => {
  let component: NurseHome;
  let fixture: ComponentFixture<NurseHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NurseHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NurseHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
