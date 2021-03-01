import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { RequestType, RestEndPoint } from 'src/app/core/models/endpoint.enum';
import { GetTrafficImgRequest, GetTrafficImgResponse, GetWeatherForecastRequest, GetWeatherForecastResponse } from 'src/app/core/models/request-response.interface';
import { BaseService } from 'src/app/core/services/base/base.service';
import { UtilService } from 'src/app/core/services/utils/util.service';

@Component({
  selector: 'app-traffic-weather-info-component',
  templateUrl: './traffic-weather-info-component.component.html',
  styleUrls: ['./traffic-weather-info-component.component.scss'],
})
export class TrafficWeatherInfoComponentComponent implements OnInit {
  timeSelected: string | undefined;
  dateSelected: any;
  trafficData: any;
  today: any;
  locationData: any;
  dateChangeEmitter: BehaviorSubject<any>;
  timeChangeEmitter: BehaviorSubject<any>;
  constructor(private baseService: BaseService, private utilService: UtilService) {
    this.dateSelected = new Date();
    this.timeSelected = this.utilService.curreTimeStamp().split('T')[1].substr(0, 5);
    this.today = new Date();
    this.dateChangeEmitter = new BehaviorSubject(undefined);
    this.timeChangeEmitter = new BehaviorSubject(undefined);
  }

  ngOnInit(): void {
    this.dateChangeEmitter.pipe(distinctUntilChanged(), filter((data) => !!data)).subscribe(() => {
      const date = new Date(this.dateSelected);
      this.getTrafficImg(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${this.timeSelected}`);
    });
    this.timeChangeEmitter.pipe(distinctUntilChanged(), filter((data) => !!data)).subscribe(() => {
      const date = new Date(this.dateSelected);
      this.getTrafficImg(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${this.timeSelected}`);
    });
    this.getTrafficImg();
    this.getWeatherForecast('', '');
  }
  /**
   * To get the traffic images as per the date and time
   */
  getTrafficImg(dateTime?: string): void {
    const param = !dateTime ? `?date_time=${this.utilService.curreTimeStamp()}` : `?date_time=${this.utilService.curreTimeStamp(dateTime)}`;
    console.log('Request body is,');
    this.baseService.sendRequest<GetTrafficImgRequest, GetTrafficImgResponse>(RestEndPoint.GetTrafficImg, RequestType.Get, param)
      .subscribe((res) => {
        this.trafficData = res;
        console.log(res);
      }, (error: any) => {
        console.log('There was an error while loading the traffic details from thee server', error);
        this.utilService.clearServerError();
      });
  }
  /**
   * @description To get weather forecast
   * @param location 
   * @param dateTime 
   */
  getWeatherForecast(location: string, dateTime: string): void {
    const param = `?area_metadata=${location}&date_time=${dateTime}`;
    this.baseService.sendRequest<GetWeatherForecastRequest, GetWeatherForecastResponse>(RestEndPoint.GetWeatherForecast, RequestType.Get)
      .subscribe((res) => {
        console.log('The location response is', res);
        this.locationData = res;
      }, (error: any) => {
        console.log('There was an error while loading the weather forecast details from the server', error);
        this.utilService.clearServerError();
      });
  }
  /**
   * @description Handler for user action to time change
   * @param event 
   */
  handleTimeChange(): void {
    if (this.dateSelected && this.timeSelected) {
      if (this.dateSelected - this.today === 0 && this.compareTime(this.timeSelected)) {
        this.timeSelected = this.utilService.curreTimeStamp().split('T')[1].substr(0, 5);
      }
      this.timeChangeEmitter.next(this.timeSelected);
    }
  }
  /**
   * @description Handler for user action to date change
   * @param event
   */
  handleDateChange(): void {
    if (this.dateSelected && this.timeSelected) {
      this.dateChangeEmitter.next(this.dateSelected);
    }
  }
  /**
   * @description To compare two timings
   * @param time1 
   */
  compareTime(time: string): boolean {
    if (+time.split(':')[0] > (new Date().getHours())) {
      return true;
    } else if (+time.split(':')[1] > (new Date().getMinutes())) {
      return true;
    }
    return false;
  }
  /**
   * Handler for user action to location change
   */
  handleLocationChange(event: any): boolean {
    this.trafficData.items[0].cameras.filter((data: any) => {
      if (data.location.longitude === event.value.longitude && data.location.latitude === event.value.latitude) {
        console.log('There was a match');
        return true;
      }
      return false;
    });
    return false;
  }
}
