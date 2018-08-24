import { Injectable } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IRankData } from '../rankings-data/rank-data.interface';
import { RankingLookupService } from '../rankings-data/ranking-lookup.service';

@Injectable({
    providedIn: 'root'
})
export class PlayerStatisticsCalculatorService {

    private _startYear = 2013;

    constructor(

        private rankingLookup: RankingLookupService

    ) { }

    get currentYear(): number {

        return new Date().getFullYear();
    }

    private getRank(rankings: IRankData[], id: number): number {

        const rankData = rankings.find(data => data.playerId === id);

        return rankData ? rankData.position : null;
    }

    public getCurrentRanking(id: number): Observable<number> {

        return this.rankingLookup.getRankings(this.currentYear).pipe(

            switchMap(rankings => {

                return of(rankings ? this.getRank(rankings, id) : null);
            })
        );
    }

    private getRankingSince(startYear: number): Observable<IRankData[]>[] {

        const rankings: Observable<IRankData[]>[] = [];

        for (let i = startYear; i <= this.currentYear; i++) {

            rankings.push(this.rankingLookup.getRankings(i));
        }

        return rankings;
    }

    private getMaxOrMinRanking(id: number, callback: (a: number, b: number) => number): Observable<number> {

        return combineLatest(this.getRankingSince(this._startYear)).pipe(

            switchMap(rankings => {

                let result: number = null;

                rankings.filter(ranking => ranking).forEach(ranking => {

                    const rank = this.getRank(ranking, id);

                    if (rank) {

                        result = result ? callback(result, rank) : rank;
                    }
                });

                return of(result);
            })
        );
    }

    public getLowestRanking(id: number): Observable<number> {

        return this.getMaxOrMinRanking(id, Math.max);
    }

    public getHighestRanking(id: number): Observable<number> {

        return this.getMaxOrMinRanking(id, Math.min);
    }
}
