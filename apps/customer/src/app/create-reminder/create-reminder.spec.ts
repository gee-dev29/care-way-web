import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReminder } from './create-reminder';

describe('CreateReminder', () => {
  let component: CreateReminder;
  let fixture: ComponentFixture<CreateReminder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateReminder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateReminder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
