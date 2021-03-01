import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponentComponent } from './home-component.component';
import { TrafficWeatherInfoModule } from '../traffic-weather-info/traffic-weather-info.module';



@NgModule({
  declarations: [HomeComponentComponent],
  imports: [
    CommonModule,
    TrafficWeatherInfoModule
  ]
})
export class HomeModule { }
