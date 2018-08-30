import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IRankData } from '../rankings-data/rank-data.interface';
import { RankingLookupService } from '../rankings-data/ranking-lookup.service';
import { APP_CONFIG } from '../../../app-config';

@Injectable({
    providedIn: 'root'
})
export class PlayerStatisticsCalculatorService {

    constructor(

        @Inject(APP_CONFIG) private configuration,
        private lookup: RankingLookupService

    ) { }

    get currentYear(): number {

        return new Date().getFullYear();
    }

    get supportedYears(): number[] {

        const supported: number[] = [];
        const start = this.configuration.startYear;
        const end = this.currentYear;

        for (let i = start; i <= end; i++) {

            supported.push(i);
        }

        return supported;
    }

    private getRank(rankings: IRankData[], id: number): number {

        const data = rankings.find(ranking => ranking.playerId === id);

        return data ? data.position : null;
    }

    private getEarning(rankings: IRankData[], id: number): number {

        const data = rankings.find(ranking => ranking.playerId === id);

        return data ? data.earnings : 0;
    }

    public getRankHistory(id: number): Observable<{ year: number, rank: number }[]> {

        return this.lookup.getRankingsSince(this.configuration.startYear).pipe(

            switchMap(rankings => {

                const history = rankings.map((ranking, index) => {

                    const year = this.configuration.startYear + index;
                    const rank = ranking ? this.getRank(ranking, id) : null;

                    return { year, rank };
                });

                return of(history);
            })
        );
    }

    public getEarningHistory(id: number): Observable<{ year: number, earning: number }[]> {

        return this.lookup.getRankingsSince(this.configuration.startYear).pipe(

            switchMap(rankings => {

                const history = rankings.map((ranking, index) => {

                    const year = this.configuration.startYear + index;
                    const earning = ranking ? this.getEarning(ranking, id) : 0;

                    return { year, earning };
                });

                return of(history);
            })
        );
    }

    public getCurrentRank(id: number): Observable<number> {

        return this.lookup.getRankings(this.currentYear).pipe(

            switchMap(rankings => {

                return of(rankings ? this.getRank(rankings, id) : null);
            })
        );
    }

    private compareRank(

        current: number,
        toCompare: number,
        compare: (a: number, b: number) => number

    ): number {

        if (toCompare) {

            current = current ? compare(current, toCompare) : toCompare;
        }

        return current;
    }

    public getHighestRank(id: number): Observable<number> {

        return this.lookup.getRankingsSince(this.configuration.startYear).pipe(

            switchMap(rankings => {

                const result = rankings.reduce((rank, current) => {

                    const toCompare = current ? this.getRank(current, id) : null;

                    return this.compareRank(rank, toCompare, Math.min);

                }, 0);

                return of(result === 0 ? null : result);
            })
        );
    }

    public getLowestRank(id: number): Observable<number> {

        return this.lookup.getRankingsSince(this.configuration.startYear).pipe(

            switchMap(rankings => {

                const result = rankings.reduce((rank, current) => {

                    const toCompare = current ? this.getRank(current, id) : null;

                    return this.compareRank(rank, toCompare, Math.max);

                }, 0);

                return of(result === 0 ? null : result);
            })
        );
    }

    public getTotalEarning(id: number): Observable<number> {

        return this.lookup.getRankingsSince(this.configuration.startYear).pipe(

            switchMap(rankings => {

                const result = rankings.reduce((total, current) => {

                    const earning = current ? this.getEarning(current, id) : 0;

                    return total + earning;

                }, 0);

                return of(result);
            })
        );
    }
}
