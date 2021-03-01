import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
  private isServerError: Subject<boolean>;

  constructor() {
    this.isServerError = new Subject();
  }

  get serverError(): Subject<boolean> {
    return this.isServerError;
  }

  /**
   * To update server error status
   */
  createServerError(): void {
    this.isServerError.next(true);
  }

  /**
   * To clear server error
   */
  clearServerError(): void {
    this.isServerError.next(false);
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
   *  @description To set cookie value
   * *@param cookieValue
   */
  set cookie(cookieValue) {
    window.document.cookie = cookieValue;
  }

  /**
   * to get local storage instance
   */
  get localStorage(): any {
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
   * @description To get current date with timestamp
   * @param dateParam 
   */
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
  /**
   * @description To convert a single digit to double digit
   * @param num
   */
  convertToTwoDigit(num: number): string | number {
    return num < 10 ? `0${num}` : num;
  }

}

