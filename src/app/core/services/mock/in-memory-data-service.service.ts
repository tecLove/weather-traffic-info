import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import * as mockTrafficImg from '../../../../assets/in-memory-data/environment/traffic-images.json';
import * as mockWeatherFrcast from '../../../../assets/in-memory-data/transport/2-hour-weather-forecast.json';
import { FormEndPoint } from '../../models/endpoint.enum';
/**
 * In memory database service
 */
@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() {
  }
  createDb() {
    const forms = [
      { id: 1, name:  FormEndPoint.GetTrafficImg, metadata: mockTrafficImg },
      { id: 2, name:  FormEndPoint.GetWeatherForecast, metadata: mockWeatherFrcast },
    ];
    return {forms};
  }
}
