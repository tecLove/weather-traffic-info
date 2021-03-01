import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrafficWeatherInfoComponentComponent } from './traffic-weather-info-component.component';
import { AppMateialModule } from 'src/app/shared/app-mateial/app-mateial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [TrafficWeatherInfoComponentComponent],
  imports: [
    CommonModule,
    AppMateialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [TrafficWeatherInfoComponentComponent]
})
export class TrafficWeatherInfoModule { }
