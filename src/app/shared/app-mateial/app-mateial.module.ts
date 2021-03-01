import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
  exports: [MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatFormFieldModule, NgxMaterialTimepickerModule]
})
export class AppMateialModule { }
