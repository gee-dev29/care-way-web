import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHmo } from './create-hmo';

describe('CreateHmo', () => {
  let component: CreateHmo;
  let fixture: ComponentFixture<CreateHmo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHmo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateHmo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
