import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { BaseService } from 'src/app/core/services/base/base.service';

import { TrafficWeatherInfoComponentComponent } from './traffic-weather-info-component.component';

class FakeBaseService {
  sendRequest(): Observable<any> {
    console.log('Send request method was called');
    return of({items: [{cameras: []}]});
  }
}
let baseService: BaseService;
describe('TrafficWeatherInfoComponentComponent', () => {
  let component: TrafficWeatherInfoComponentComponent;
  let fixture: ComponentFixture<TrafficWeatherInfoComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ TrafficWeatherInfoComponentComponent ],
      providers: [ { provide: BaseService, useClass: FakeBaseService }],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrafficWeatherInfoComponentComponent);
    component = fixture.componentInstance;
    baseService = TestBed.inject(BaseService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should verify compareTime', () => {
    expect(component.compareTime(`2021-03-04:12 22 00`)).toBeFalsy();
  });
  it('should verify getReverseGeoCoding', () => {
    const testData = { latitude: 1.319278, longitude: 103.878533 };
    component.getReverseGeoCoding(testData).subscribe((res: any) => {
       expect(res.items[0].cameras.location.latitude).toEqual('1');
    });
  });
});
