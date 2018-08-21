import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { ICanFetchRanking } from './can-fetch-ranking.interface';
import { IRankItem } from './rank-item.interface';
import { RankItem } from './rank-item';

@Injectable({
    providedIn: 'root'
})
export class LiveRankingFetcherService implements ICanFetchRanking {

    constructor(private httpClient: HttpClient) { }

    protected toRankItems(items: object[]): IRankItem[] {

        const rankItems: IRankItem[] = [];

        for (const item of items) {

            rankItems.push(new RankItem(

                item['Position'], item['PlayerID'], item['Sum'], item['Type']
            ));
        }

        return rankItems;
    }

    public fetch(year: number, type: string = 'MoneyRankings'): Observable<IRankItem[]> {

        const url = `http://api.snooker.org/?rt=${type}&s=${year}`;

        return this.httpClient.get<object>(url).pipe(

            retry(2),
            switchMap(items => of(this.toRankItems(<object[]>items))),
            catchError(error => of(null))
        );
    }
}
