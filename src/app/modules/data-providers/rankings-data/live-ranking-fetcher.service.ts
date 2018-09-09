import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { IRankData } from './rank-data.interface';
import { RankData } from './rank-data';

@Injectable({
    providedIn: 'root'
})
export class LiveRankingFetcherService {

    constructor(private httpClient: HttpClient) { }

    protected toRankItems(items: object[]): IRankData[] {

        const rankItems: IRankData[] = [];

        for (const item of items) {

            rankItems.push(new RankData(

                item['Position'], item['PlayerID'], item['Sum'], item['Type']
            ));
        }

        return rankItems;
    }

    public fetch(year: number, type: string = 'MoneyRankings'): Observable<IRankData[]> {

        const url = `https://cors.io?http://api.snooker.org/?rt=${type}&s=${year}`;

        return this.httpClient.get<object>(url).pipe(

            retry(2),
            map(items => this.toRankItems(<object[]>items)),
            catchError(error => of(null))
        );
    }
}
