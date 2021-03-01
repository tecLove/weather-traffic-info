import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { RequestType, RestEndPoint } from '../../models/endpoint.enum';
import Environment from '../../models/environment.interface';
import { UtilService } from '../utils/util.service';

import { BaseService } from './base.service';

describe('Base Service', () => {
  let service: BaseService;
  let httpTestingController: HttpTestingController;
  let env: Environment;
  let utils: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BaseService, {
        provide: UtilService, useValue: { environment: () => 'development' }
      }]
    });
    service = TestBed.inject(BaseService);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
    utils = TestBed.inject(UtilService);
    env = utils.environment;
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  /**
   * * method to mock the back
   * * @param testData
   * * @param restEndPoint
   * * @param requestType
   * * @param body
   * * @param error
   */
  function mockHttpBackend(testData: any, restEndPoint: RestEndPoint, requestType: RequestType, body?: any, error?: HttpErrorResponse)
    : void {
    const requestBody = body ? body : null;
    const mockTestData = service.isMock ? testData[0].metadata : testData;
    service.sendRequest(restEndPoint, requestType, requestBody)
      .subscribe((data) =>
        expect(data).toEqual(mockTestData));
    const reqParam = !service.isMock ? env.appCntxt + restEndPoint
      : env.appCntxt + '/mockdata/forms' + '/?name=' + restEndPoint.split('/').reverse()[0];
    const req = httpTestingController.expectOne(reqParam);
    expect(req.request.method).toEqual(requestType);
    req.flush(testData);
    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  }

  /**
   *  method to mock backend with error
   * * @param restEndPoint
   * * @param requestType
   * * @param body
   * * @param error
   */
  function mockHttpBackendWithError(restEndPoint: RestEndPoint, requestType: RequestType, body?: any, error?: any): void {
    const requestBody = body ? body : null;
    const emsg = 'deliberate 404 error';
    service.sendRequest(restEndPoint, requestType, requestBody)
      .subscribe(() => fail('failed with error'), (ERROR) => {
        const BackendError = ERROR;
        expect(BackendError.status).toEqual(404, 'status');
        expect(BackendError.error).toEqual(emsg, 'message');
      });
    const req = httpTestingController.expectOne(env.appCntxt + restEndPoint);
    expect(req.request.method).toEqual(requestType);
    req.flush(emsg, error);
    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  }

  /**
   * method to mock http request with network error
   * * @param restEndPoint
   * * @param requestType
   * * @param body
   * * @param error
   */
  function mockHttpFrontEndWithError(restEndPoint: RestEndPoint, requestType: RequestType, body?: any, error?: any): void {
    const requestBody = body ? body : null;
    const emsg = 'simulated network error';
    service.sendRequest(restEndPoint, requestType, requestBody)
      .subscribe(() => fail('should have failed with the network error'), (ERROR) => {
        const NetworkError = ERROR.error;
        expect(NetworkError).toEqual(emsg, 'message');
      });
    const req = httpTestingController.expectOne(env.appCntxt + restEndPoint);
    const mockError = new ErrorEvent('Network error', {
      message: emsg,
    });
    req.error(mockError);
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call sendRequest method with PUT', () => {
    const testData: { url: string } = { url: 'Test Data' };
    service.isMock = false;
    mockHttpBackend(testData, RestEndPoint.GetTrafficImg, RequestType.Put, { email: 'email', username: 'username' });
  });

  it('should call sendRequest method with POST', () => {
    const testData: { url: string } = { url: 'Test Data' };
    mockHttpBackend(testData, RestEndPoint.GetTrafficImg, RequestType.Get, { email: 'email', password: 'password' });
  });
  it('should call sendRequest method with GET', () => {
    const testData: { url: string } = { url: 'Test Data' };
    mockHttpBackend(testData, RestEndPoint.GetTrafficImg, RequestType.Get, {});
  });
  it('should fail with backend error-404 ', () => {
    mockHttpBackendWithError(RestEndPoint.GetWeatherForecast, RequestType.Get,
      { email: 'email' }, { status: 404, statusText: 'Not Found' });
  });
  it('should fail with front end network error ', () => {
    mockHttpFrontEndWithError(RestEndPoint.GetTrafficImg, RequestType.Get, {});
  });
  it('it should test handleResponse method for mock services', () => {
    service.isMock = true;
    const inputData = [{ metadata: '' }];
    const result = service.handleResponse(inputData);
    expect(result).toEqual((''));
  });
  it('should call sendRequest method with GET', () => {
    const testData = [{ metadata: 'Test Data' }];
    service.isMock = true;
    env.mock = true;
    mockHttpBackend(testData, RestEndPoint.GetTrafficImg, RequestType.Get, {});
  });
  it('should call customRetryStrategy method', () => {
    const obser = service.customRetryStrategy();
    expect(obser).toBeTruthy();
    obser(new Observable()).subscribe((data) => expect(data).toBeNull());
  });
  it('should call finalizeCallBack method', () => {
    spyOn(console, 'log').and.callThrough();
    service.finalizeCallBack();
    expect(console.log).toHaveBeenCalledWith('Done with retry method, check console whether retry was fired or not');
  });
  it('should call customStrategyCallBack method', () => {
    spyOn(console, 'log').and.callThrough();
    let obser = service.customStrategyCallBack();
    expect(obser).toBeTruthy();
    obser = service.customStrategyCallBack({ maxRetryAttempt: 3, includedStatusCodes: [504] });
    expect(obser({ status: 0 }, 0)).toBeTruthy();
    obser({ status: 504 }, 0);
    expect(console.log).toHaveBeenCalled();
  });
  it('should test handle error method', () => {
    const httpErrorResponse = new HttpErrorResponse({ error: { error: { message: 'something went wrong' } } });
    expect(service.handleError(httpErrorResponse)).toBeTruthy();
  });
});
