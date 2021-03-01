import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficWeatherInfoComponentComponent } from './traffic-weather-info-component.component';

describe('TrafficWeatherInfoComponentComponent', () => {
  let component: TrafficWeatherInfoComponentComponent;
  let fixture: ComponentFixture<TrafficWeatherInfoComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficWeatherInfoComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrafficWeatherInfoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
