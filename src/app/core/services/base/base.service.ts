import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, finalize, map, mergeMap, retryWhen } from 'rxjs/operators';
import { RequestType, RestEndPoint } from '../../models/endpoint.enum';
import { UtilService } from '../utils/util.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};

/**
 * Injectable decorator
 */
@Injectable({
  providedIn: 'root'
})
/**
 * class from where every http request of application will pass through
 */
export class BaseService {
  isMock = this.util.environment.mock;
  endPoint = '';

  constructor(private http: HttpClient, private util: UtilService) {
  }

  /**
   * End method to make http call based on request types
   * * @param endpoint
   * * @param requestType
   * * @param body
   */
  sendRequest<Rq, Rs>(endpoint: RestEndPoint | string, requestType: RequestType, param?: string, body?: Rq): Observable<HttpResponse<Rs>> {
    this.endPoint = endpoint;
    this.setAuthHeader();
    const baseUrl = this.util.environment.production ? '' : this.util.environment.apiBaseUrl;
    let url = baseUrl + (this.isMock ? this.util.environment.appCntxt + RestEndPoint.MockService + '/?name=' + endpoint.split('/').reverse()[0]
      : this.util.environment.appCntxt + endpoint);
    url = param ? `${url}${param}` : url;
    const REQUEST_TYPES = this.isMock ? RequestType.Get : requestType;
    switch (REQUEST_TYPES) {
      case RequestType.Get:
        return this.get(url).pipe(retryWhen(this.customRetryStrategy({ includedStatusCodes: [504, 400] })), map(this.handleResponse), catchError(this.handleError));
      case RequestType.Put:
        return this.put(url, body).pipe(map(this.handleResponse), catchError(this.handleError));
    }
  }

  /**
   * http get request
   * * * @param url
   */
  private get(url: string) {
    return this.http.get(url, httpOptions);
  }

  /**
   * http put request
   * * @param url
   * * @param body
   */
  private put(url: string, body: any) {
    return this.http.put(url, body, httpOptions);
  }

  /**
   * to handle http error
   * * @param error
   */
  public handleError = (error: HttpErrorResponse): Observable<any> => {
    let httpError = null;
    if (error.error instanceof ErrorEvent) {
      // error occurred at client side or network error
      httpError = { error: error.error.message };
    } else {
      // error occurred at back end
      const err = error.error.error ? error.error.error.message : error.error;
      const code = error.error.error ? error.error.error.code : error.status;
      httpError = { error: err, status: code, endPoint: this.endPoint };
    }
    return throwError(
      httpError
    );
  }

  /**
   * to handle http response
   * * @param response
   */
  public handleResponse = (response: any) => {
    return this.isMock ? response[0].metadata : response;
  }

  /**
   * method to handle auth header set
   */
  setAuthHeader() {
    // to add any custom header modification
  }

  /**
   * custom strategy to make retry attempt on request failure
   * *@param maxRetryAttempt
   * *@param scalingDuration
   * *@param includedStatusCodes
   */
  customRetryStrategy = (
    {
      maxRetryAttempt = 1,
      scalingDuration = 1000,
      includedStatusCodes = []
    }: {
      maxRetryAttempt?: number,
      scalingDuration?: number,
      includedStatusCodes?: number[]
    } = {}) => (attempts: Observable<any>) => {
      return attempts.pipe(
        mergeMap(this.customStrategyCallBack({ maxRetryAttempt, scalingDuration, includedStatusCodes })),
        finalize(this.finalizeCallBack)
      );
    }
  /**
   * call back method for finalize call
   */
  finalizeCallBack = () => console.log('Done with retry method, check console whether retry was fired or not');

  /**
   * call back
   * *@param maxRetryAttempt
   * *@param scalingDuration
   * *@param includedStatusCodes
   */
  customStrategyCallBack = (
    {
      maxRetryAttempt = 1,
      scalingDuration = 1000,
      includedStatusCodes = []
    }: {
      maxRetryAttempt?: number,
      scalingDuration?: number,
      includedStatusCodes?: number[]
    } = {}) => (error: any, i: number) => {
      const retryAttempt = i + 1;
      if (
        retryAttempt > maxRetryAttempt ||
        !includedStatusCodes.includes(error.status)
      ) {
        return throwError(error);
      }
      console.log(
        `Attempt ${retryAttempt}: retrying in ${retryAttempt *
        scalingDuration}ms`
      );
      return timer(retryAttempt * scalingDuration);
    }
}
