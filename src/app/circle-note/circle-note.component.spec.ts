import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleNoteComponent } from './circle-note.component';

describe('CircleNoteComponent', () => {
  let component: CircleNoteComponent;
  let fixture: ComponentFixture<CircleNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircleNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircleNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
