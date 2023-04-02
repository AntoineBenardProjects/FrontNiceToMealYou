import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoisirsPageComponent } from './loisirs-page.component';

describe('LoisirsPageComponent', () => {
  let component: LoisirsPageComponent;
  let fixture: ComponentFixture<LoisirsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoisirsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoisirsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
