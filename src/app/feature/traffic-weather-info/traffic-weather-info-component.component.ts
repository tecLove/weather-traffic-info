import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { RequestType, RestEndPoint } from 'src/app/core/models/endpoint.enum';
import { GetTrafficImgRequest, GetTrafficImgResponse, GetWeatherForecastRequest, GetWeatherForecastResponse } from 'src/app/core/models/request-response.interface';
import { BaseService } from 'src/app/core/services/base/base.service';
import { UtilService } from 'src/app/core/services/utils/util.service';
const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-traffic-weather-info-component',
  templateUrl: './traffic-weather-info-component.component.html',
  styleUrls: ['./traffic-weather-info-component.component.scss'],
})
export class TrafficWeatherInfoComponentComponent implements OnInit {
  _time: string | undefined;
  _date: any;
  trafficData: any;
  locationData: any;
  dateChangeEmitter: BehaviorSubject<any>;
  timeChangeEmitter: BehaviorSubject<any>;
  constructor(private baseService: BaseService, private utilService: UtilService) {
    this._date = new Date();
    this._time = this.utilService.curreTimeStamp().split('T')[1].substr(0,5);
    this.dateChangeEmitter = new BehaviorSubject(undefined);
    this.timeChangeEmitter = new BehaviorSubject(undefined);
   }

  ngOnInit(): void {
    this.dateChangeEmitter.pipe(distinctUntilChanged(), filter((data) => !!data)).subscribe(() => {
      console.log("Date was changed");
      const date = new Date(this._date);
      this.getTrafficImg(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${this._time}`);
    });
    this.timeChangeEmitter.pipe(distinctUntilChanged(), filter((data) => !!data)).subscribe(() => {
      console.log("Time was changed");
      const date = new Date(this._date);
      this.getTrafficImg(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${this._time}`);
    });
    this.getTrafficImg();
    this.getWeatherForecast('', '');
  }

  getTrafficImg(dateTime?: string) {
    const param = !dateTime ? `?date_time=${this.utilService.curreTimeStamp()}` : `?date_time=${this.utilService.curreTimeStamp(dateTime)}`;
    console.log('Request body is,'); 
    this.baseService.sendRequest<GetTrafficImgRequest, GetTrafficImgResponse>(RestEndPoint.GetTrafficImg, RequestType.Get, param).subscribe((res) => {
      this.trafficData = res;
      console.log(res);
    });
  }

  getWeatherForecast(location: string, dateTime: string) {
    const param = `?area_metadata=${location}&date_time=${dateTime}`
    this.baseService.sendRequest<GetWeatherForecastRequest, GetWeatherForecastResponse>(RestEndPoint.GetWeatherForecast, RequestType.Get).subscribe((res) => {
      console.log("The location response is", res); 
      this.locationData = res;
    });
  }

  handleTimeChange(event: any) {
    if (this._date && this._time) {
      this.timeChangeEmitter.next(this._time);
    }
  }

  handleDateChange(event: any) {
    if(this._date && this._time) {
      this.dateChangeEmitter.next(this._date);
    }
  }

  handleLocationChange(event: any) {debugger;
    this.trafficData.items[0].cameras.filter((data: any) => {
      if (data.location.longitude === event.value.longitude && data.location.latitude === event.value.latitude) {
        console.log('There was a match');
        return true;
      }
      return false;
    })
  }
}
