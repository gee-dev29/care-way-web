import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOgtt } from './create-ogtt';

describe('CreateOgtt', () => {
  let component: CreateOgtt;
  let fixture: ComponentFixture<CreateOgtt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOgtt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOgtt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
