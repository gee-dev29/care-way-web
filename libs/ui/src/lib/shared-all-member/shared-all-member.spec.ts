import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAllMember } from './shared-all-member';

describe('SharedAllMember', () => {
  let component: SharedAllMember;
  let fixture: ComponentFixture<SharedAllMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedAllMember]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedAllMember);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
