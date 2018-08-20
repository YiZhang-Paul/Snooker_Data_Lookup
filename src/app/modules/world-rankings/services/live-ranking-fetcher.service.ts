import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICanFetchRanking } from './can-fetch-ranking.interface';

@Injectable({
    providedIn: 'root'
})
export class LiveRankingFetcherService implements ICanFetchRanking {

    constructor(private httpClient: HttpClient) { }

    public fetch(year: number, type: string = 'MoneyRankings'): Observable<object> {

        const url = `http://api.snooker.org/?rt=${type}&s=${year}`;

        return this.httpClient.get<object>(url).pipe(

            catchError(error => of(null))
        );
    }
}
