import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

class CacheItem {

    constructor(

        public response: HttpResponse<any>,
        public timestamp: number,
        public request?: HttpRequest<any>

    ) { }
}

@Injectable({
    providedIn: 'root'
})
export class DataCacheService {

    private _cache = new Map<string, CacheItem>();
    private _lifeTime = 3600000;

    constructor() { }

    get totalCached(): number {

        return this._cache.size;
    }

    get lifeTime(): number {

        return this._lifeTime;
    }

    private isExpired(cached: CacheItem): boolean {

        const elapsedTime = new Date().valueOf() - cached.timestamp;

        return elapsedTime > this._lifeTime;
    }

    public get(request: HttpRequest<any>): HttpResponse<any> {

        const key = request.urlWithParams;
        const cached = this._cache.get(key);

        if (!cached || this.isExpired(cached)) {

            this._cache.delete(key);

            return null;
        }

        return cached.response;
    }

    public set(request: HttpRequest<any>, response: HttpResponse<any>): void {

        const key = request.urlWithParams;
        const cached = new CacheItem(response, new Date().valueOf());
        this._cache.set(key, cached);
    }
}
