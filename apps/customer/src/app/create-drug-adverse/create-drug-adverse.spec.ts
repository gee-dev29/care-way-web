import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDrugAdverse } from './create-drug-adverse';

describe('CreateDrugAdverse', () => {
  let component: CreateDrugAdverse;
  let fixture: ComponentFixture<CreateDrugAdverse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDrugAdverse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDrugAdverse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
