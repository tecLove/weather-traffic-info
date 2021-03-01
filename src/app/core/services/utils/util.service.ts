import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

import { environment } from '../../../../environments/environment';
import Environment from '../../models/environment.interface';
/**
 * Injectable decorator
 */
@Injectable(
  {
    providedIn: 'root'
  }
)
/**
 * class to handle all utilities need application wide
 */
export class UtilService {
  constructor() { }


  /**
   * to handle the max length of a input field
   * *@param control
   * *@param maxLength
   */
  handleNumLength(control: FormControl, maxLength: number) {
    return control.value ? (control.value.toString().length >= maxLength ? false : true) : true;
  }

  /**
   * to get environment details - prod/ dev
   */
  get environment(): Environment {
    return environment;
  }

  /**
   * to get cookie instance
   */
  get cookie() {
    return window.document.cookie;
  }
  /**
   * to set cookie value
   * *@param cookieValue
   */
  set cookie(cookieValue) {
    window.document.cookie = cookieValue;
  }

  /**
   * to get local storage instance
   */
  get localStorage() {
    return window.localStorage;
  }

  /**
   * to get session storage instance
   */
  get sessionStorage() {
    return window.sessionStorage;
  }

  /**
   * to get window location object
   */
  get windowLocation() {
    return window.location;
  }

  /**
   * method to convert a word/ sentence to title case
   * *@param str
   */
  toTitleCase = (str: string) => {
    return str.replace(/(^|\s)\S/g, (t) => {
      return t.toUpperCase();
    });
  }

  curreTimeStamp(dateParam?: string): string {
    const date = dateParam ? new Date(dateParam) : new Date();
    const _year = this.convertToTwoDigit(date.getFullYear());
    const _month = this.convertToTwoDigit(date.getMonth() + 1);
    const _date =this.convertToTwoDigit(date.getDate()); 
    const _hours = this.convertToTwoDigit(date.getHours());
    const _mins = this.convertToTwoDigit(date.getMinutes());
    const _seconds = this.convertToTwoDigit(date.getSeconds());
    
    return `${_year}-${_month}-${_date}T${_hours}:${_mins}:${_seconds}`
  }

  convertToTwoDigit(num: number): string | number {
    return num < 10 ? `0${num}` : num;
  }
}

