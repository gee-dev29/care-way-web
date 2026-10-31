import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingPlayer } from './recording-player';

describe('RecordingPlayer', () => {
  let component: RecordingPlayer;
  let fixture: ComponentFixture<RecordingPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordingPlayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordingPlayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
