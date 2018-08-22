import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';

export class ActivatedRouteStub {

    private subject = new ReplaySubject<ParamMap>();
    readonly paramMap = this.subject.asObservable();
    public parent: ActivatedRouteStub;

    constructor(initialParams?: Params) {

        this.setParamMap(initialParams);
    }

    public setParamMap(params?: Params) {

        this.subject.next(convertToParamMap(params));
    }
}
