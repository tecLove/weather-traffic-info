import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponentComponent } from './home-component.component';
import { TrafficWeatherInfoModule } from '../traffic-weather-info/traffic-weather-info.module';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [HomeComponentComponent],
  imports: [
    CommonModule,
    TrafficWeatherInfoModule,
    SharedModule
  ]
})
export class HomeModule { }
