import { of } from 'rxjs';
import { BaseComponent } from './base.component';

let psc: BaseComponent;
describe('Base Component', () => {
  beforeEach(() => {
    psc = new BaseComponent();
  });
  it('should create', () => {
    psc.init();
    expect(psc).toBeTruthy();
  });
  it('should call after view init', () => {
    const spy = spyOn(psc, 'viewInit').and.callThrough();
    psc.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });
  it('should call ngOnDestroy life cycle hook with true subscription', () => {
    psc.subscriptions.push(of({}).subscribe(() => null));
    psc.ngOnDestroy();
    psc.onChange({});
    expect(psc.subscriptions.length).toEqual(1);
  });
  it('should call ngOnDestroy life cycle hook with false subscription', () => {
    const sub = of({});
    spyOn(sub, 'subscribe').and.returnValue(false);
    psc.subscriptions.push(sub.subscribe());
    psc.ngOnDestroy();
    expect(psc.subscriptions.length).toEqual(1);
  });
});
