import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { RequestType, RestEndPoint } from 'src/app/core/models/endpoint.enum';
import {
  GetTrafficImgRequest, GetTrafficImgResponse, GetWeatherForecastRequest, GetWeatherForecastResponse,
  RevGeoCodResponse
} from 'src/app/core/models/request-response.interface';
import { BaseService } from 'src/app/core/services/base/base.service';
import { UtilService } from 'src/app/core/services/utils/util.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as _moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-traffic-weather-info-component',
  templateUrl: './traffic-weather-info-component.component.html',
  styleUrls: ['./traffic-weather-info-component.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class TrafficWeatherInfoComponentComponent implements OnInit {
  timeSelected: string | undefined;
  dateSelected: any;
  trafficData: any;
  trafficDataOrig: any;
  today: any;
  isLocationLoaded: boolean;
  locationData: Array<any>;
  dateChangeEmitter: BehaviorSubject<any>;
  timeChangeEmitter: BehaviorSubject<any>;
  selectedLocation = { location: {}, name: 'Select' };
  WeatherForSelectedLoc: string;
  constructor(private baseService: BaseService, private utilService: UtilService, private cdr: ChangeDetectorRef) {
    this.today = new Date();
    this.dateSelected = this.today;
    this.timeSelected = this.utilService.curreTimeStamp().split('T')[1].substr(0, 5);
    this.dateChangeEmitter = new BehaviorSubject(undefined);
    this.timeChangeEmitter = new BehaviorSubject(undefined);
    this.locationData = [];
    this.isLocationLoaded = false;
    this.WeatherForSelectedLoc = '';
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
  }
  /**
   * To get the traffic images as per the date and time
   */
  getTrafficImg(dateTime?: string): void {
    this.utilService.toggleLoader = true;
    const param = !dateTime ? `?date_time=${this.utilService.curreTimeStamp()}` : `?date_time=${this.utilService.curreTimeStamp(dateTime)}`;
    console.log('Request body is,');
    this.baseService.sendRequest<GetTrafficImgRequest, GetTrafficImgResponse>(RestEndPoint.GetTrafficImg, RequestType.Get, param)
      .subscribe((res) => {
        this.utilService.toggleLoader = false;
        this.trafficDataOrig = res;
        this.trafficData = res;
        if (this.locationData[0]?.label_location) {
          this.selectedLocation.location = this.locationData[0].label_location;
          this.selectedLocation.name = this.locationData[0].name;
        }
        this.prepareLocationData(res);
        console.log(res);
      }, (error: any) => {
        console.log('There was an error while loading the traffic details from thee server', error);
        this.utilService.createServerError();
      });
  }
  /**
   * @description To get weather forecast
   * @param location of type string
   * @param dateTime of type string
   */
  getWeatherForecast(dateTime: string): void {
    this.WeatherForSelectedLoc = '';
    const param = !dateTime ? `?date_time=${this.utilService.curreTimeStamp()}` : `?date_time=${this.utilService.curreTimeStamp(dateTime)}`;
    this.baseService.sendRequest<GetWeatherForecastRequest, GetWeatherForecastResponse>(RestEndPoint.GetWeatherForecast,
      RequestType.Get, param)
      .pipe(distinctUntilChanged())
      .subscribe((res: any) => {
        console.log('The location response is', res);
        res.items[0].forecasts.forEach(element => {
          if (this.selectedLocation.name.match(element.area) || element.area.match(this.selectedLocation.name)) {
            this.WeatherForSelectedLoc = element.forecast;
          }
        });
      }, (error: any) => {
        console.log('There was an error while loading the weather forecast details from the server', error);
        this.utilService.clearServerError();
      });
  }
  /**
   * @description Handler for user action to time change
   */
  handleTimeChange(): void {
    if (this.dateSelected && this.timeSelected) {
      if (this.dateSelected - this.today === 0 && this.compareTime(this.timeSelected)) {
        this.timeSelected = this.utilService.curreTimeStamp().split('T')[1].substr(0, 5);
        this.cdr.detectChanges();
      }
      this.timeChangeEmitter.next(this.timeSelected);
    }
  }
  /**
   * @description Handler for user action to date change
   */
  handleDateChange(): void {
    if (this.dateSelected && this.timeSelected) {
      this.dateChangeEmitter.next(this.dateSelected);
    }
  }
  /**
   * @description To compare two timings
   * @param time1 of type string
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
    this.selectedLocation.name = event.source.selected.viewValue;
    console.log(event);
    this.trafficData = {
      items: [{
        cameras: this.trafficDataOrig.items[0].cameras.filter((data: any) =>
          data.location.longitude === event.value.longitude && data.location.latitude === event.value.latitude
        )
      }]
    };
    const date = new Date(this.dateSelected);
    this.getWeatherForecast(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${this.timeSelected}`);
    return false;
  }

  prepareLocationData(data: any): void {
    if (this.locationData.length === 0) {
      const subscription = [];
      for (const loc of data.items[0]?.cameras) {
        this.locationData.push({ label_location: { latitude: loc.location.latitude, longitude: loc.location.longitude } });
        subscription.push(this.getReverseGeoCoding(loc.location));
      }
      combineLatest(subscription).pipe().subscribe((res: Array<any>) => {
        for (let i = 0; i < res.length; i++) {
          if (res[i].data.length) {
            this.locationData[i].name = res[i].data[0]?.name;
          }
        }
        this.locationData = this.locationData.filter((location) => location.name !== undefined);
        this.locationData.unshift({ label_location: { latitude: 0, longitude: 0 }, name: 'Select' });
        this.selectedLocation.location = this.locationData[0].label_location;
        this.selectedLocation.name = this.locationData[0].name;
        console.log('Location data is', this.locationData);
        this.isLocationLoaded = true;
      });
    }
  }

  getReverseGeoCoding(loc: { latitude: number, longitude: number }): Observable<HttpResponse<any>> {
    const param = `?access_key=${this.utilService.environment.accessKey}&query=${loc.latitude},${loc.longitude}&output=json`;
    return this.baseService.sendRequest<{}, RevGeoCodResponse>(RestEndPoint.ReverseGeoCoding, RequestType.Get, param);
  }
}
