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

    constructor(private lookup: RankingLookupService) { }

    get currentYear(): number {

        return new Date().getFullYear();
    }

    private getRanking(rankings: IRankData[], id: number): number {

        const data = rankings.find(ranking => ranking.playerId === id);

        return data ? data.position : null;
    }

    private getEarnings(rankings: IRankData[], id: number): number {

        const data = rankings.find(ranking => ranking.playerId === id);

        return data ? data.earnings : 0;
    }

    private getRankingSince(startYear: number): Observable<IRankData[]>[] {

        const rankings: Observable<IRankData[]>[] = [];

        for (let i = startYear; i <= this.currentYear; i++) {

            rankings.push(this.lookup.getRankings(i));
        }

        return rankings;
    }

    private getStatistics(

        id: number,
        extractData: (rankings: IRankData[], id: number) => number,
        transformData: (current: number, newData: number) => number

    ): Observable<number> {

        return combineLatest(this.getRankingSince(this._startYear)).pipe(

            switchMap(rankings => {

                let result: number = null;

                rankings.filter(ranking => ranking).forEach(ranking => {

                    result = transformData(result, extractData(ranking, id));
                });

                return of(result);
            })
        );
    }

    private pickHigherRank(current: number, newRank: number): number {

        if (newRank) {

            current = current ? Math.min(current, newRank) : newRank;
        }

        return current;
    }

    private pickLowerRank(current: number, newRank: number): number {

        if (newRank) {

            current = current ? Math.max(current, newRank) : newRank;
        }

        return current;
    }

    private addEarnings(current: number, newEarnings: number): number {

        return (isNaN(current) ? 0 : current) + newEarnings;
    }

    public getCurrentRanking(id: number): Observable<number> {

        return this.lookup.getRankings(this.currentYear).pipe(

            switchMap(rankings => {

                return of(rankings ? this.getRanking(rankings, id) : null);
            })
        );
    }

    public getHighestRanking(id: number): Observable<number> {

        return this.getStatistics(id, this.getRanking, this.pickHigherRank);
    }

    public getLowestRanking(id: number): Observable<number> {

        return this.getStatistics(id, this.getRanking, this.pickLowerRank);
    }

    public getTotalEarnings(id: number): Observable<number> {

        return this.getStatistics(id, this.getEarnings, this.addEarnings);
    }
}
