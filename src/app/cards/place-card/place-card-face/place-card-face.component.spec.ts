import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceCardFaceComponent } from './place-card-face.component';

describe('PlaceCardFaceComponent', () => {
  let component: PlaceCardFaceComponent;
  let fixture: ComponentFixture<PlaceCardFaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceCardFaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceCardFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
