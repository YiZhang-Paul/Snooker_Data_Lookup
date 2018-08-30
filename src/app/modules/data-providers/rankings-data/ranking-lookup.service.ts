import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IRankData } from './rank-data.interface';
import { LiveRankingFetcherService } from './live-ranking-fetcher.service';

@Injectable({
    providedIn: 'root'
})
export class RankingLookupService {

    private _storage = new Map<number, IRankData[]>();
    private _currentYear = new Date().getFullYear();

    constructor(private fetcher: LiveRankingFetcherService) { }

    public getRankings(year: number): Observable<IRankData[]> {

        if (this._storage.has(year)) {

            return of(this._storage.get(year));
        }

        return this.fetcher.fetch(year).pipe(

            tap(rankings => {

                if (rankings !== null) {

                    this._storage.set(year, rankings);
                }
            })
        );
    }

    public getRankingsSince(year: number): Observable<IRankData[][]> {

        const rankings: Observable<IRankData[]>[] = [];

        for (let i = year; i <= this._currentYear; i++) {

            rankings.push(this.getRankings(i));
        }

        return forkJoin(rankings);
    }
}
