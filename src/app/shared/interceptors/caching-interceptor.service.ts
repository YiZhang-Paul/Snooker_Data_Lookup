import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';
import { DataCacheService } from '../services/data-cache.service';

@Injectable({
    providedIn: 'root'
})
export class CachingInterceptorService implements HttpInterceptor {

    constructor(private dataCache: DataCacheService) { }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const cached = this.dataCache.get(request);

        return cached ? of(cached) : this.sendRequest(request, next);
    }

    private sendRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(

            tap(httpEvent => {

                if (httpEvent instanceof HttpResponse) {

                    this.dataCache.set(request, httpEvent);
                }
            })
        );
    }
}
