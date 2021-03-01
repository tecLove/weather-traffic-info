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
  handleNumLength(control: FormControl, maxLength: number): boolean {
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
  get cookie(): string {
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
  get localStorage(): any{
    return window.localStorage;
  }

  /**
   * to get session storage instance
   */
  get sessionStorage(): any {
    return window.sessionStorage;
  }

  /**
   * to get window location object
   */
  get windowLocation(): any {
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
    const dateSelection = dateParam ? new Date(dateParam) : new Date();
    const year = this.convertToTwoDigit(dateSelection.getFullYear());
    const month = this.convertToTwoDigit(dateSelection.getMonth() + 1);
    const date = this.convertToTwoDigit(dateSelection.getDate());
    const hours = this.convertToTwoDigit(dateSelection.getHours());
    const mins = this.convertToTwoDigit(dateSelection.getMinutes());
    const seconds = this.convertToTwoDigit(dateSelection.getSeconds());
    return `${year}-${month}-${date}T${hours}:${mins}:${seconds}`;
  }

  convertToTwoDigit(num: number): string | number {
    return num < 10 ? `0${num}` : num;
  }
}

