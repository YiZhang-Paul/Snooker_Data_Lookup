import { Injectable, Inject } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IPlayer } from './player.interface';
import { IGroupValue } from './group-value.interface';
import { GroupValue } from './group-value';
import { RankingLookupService } from '../rankings-data/ranking-lookup.service';
import { PlayerLookupService } from './player-lookup.service';
import { PlayerStatisticsCalculatorService } from './player-statistics-calculator.service';
import { APP_CONFIG } from '../../../app-config';

@Injectable({
    providedIn: 'root'
})
export class PlayerAllStatisticsCalculatorService {

    private _currentYear = new Date().getFullYear();
    private _ageStep = 10;
    private _earningStep = 400000;

    constructor(

        @Inject(APP_CONFIG) private configuration,
        private rankingLookup: RankingLookupService,
        private playerLookup: PlayerLookupService,
        private statistics: PlayerStatisticsCalculatorService

    ) { }

    get ageStep(): number {

        return this._ageStep;
    }

    get earningStep(): number {

        return this._earningStep;
    }

    private roundBy(value: number, step: number): number {

        return Math.floor(value / step) * step;
    }

    private trackGroups<T>(groups: Map<T, number>, key: T): void {

        groups.set(key, groups.has(key) ? groups.get(key) + 1 : 1);
    }

    private toSortEntries<T>(groups: Map<T, number>): [T, number][] {

        return Array.from(groups.entries()).sort((a, b) => {

            if (a[0] === b[0]) {

                return 0;
            }

            return a[0] < b[0] ? -1 : 1;
        });
    }

    private toGroupValues<T>(groups: Map<T, number>, total: number): IGroupValue<T>[] {

        return this.toSortEntries(groups).map(entry => {

            return new GroupValue(entry[0], entry[1], entry[1] / total);
        });
    }

    private getPlayers(year: number): Observable<Map<number, IPlayer>> {

        return year === -1 ? this.playerLookup.players$ : this.playerLookup.getPlayers(year);
    }

    private getEarnings(players: Map<number, IPlayer>): Observable<number[]> {

        const playerList = Array.from(players.values());

        return forkJoin(playerList.map(player => {

            return this.statistics.getTotalEarning(player.id);
        }));
    }

    private getAge(player: IPlayer): number {

        const birthYear = new Date(player.dateOfBirth).getFullYear();

        return this._currentYear - birthYear + 1;
    }

    public groupByAge(year: number): Observable<IGroupValue<number>[]> {

        return this.getPlayers(year).pipe(

            switchMap(players => {

                const groups = new Map<number, number>();

                players.forEach(player => {

                    const age = this.getAge(player);
                    this.trackGroups(groups, this.roundBy(age, this._ageStep));
                });

                return of(this.toGroupValues(groups, players.size));
            })
        );
    }

    public groupByNationality(year: number): Observable<IGroupValue<string>[]> {

        return this.getPlayers(year).pipe(

            switchMap(players => {

                const groups = new Map<string, number>();

                players.forEach(player => {

                    this.trackGroups(groups, player.nationality);
                });

                return of(this.toGroupValues(groups, players.size));
            })
        );
    }

    public groupByStatus(year: number): Observable<IGroupValue<boolean>[]> {

        return this.getPlayers(year).pipe(

            switchMap(players => {

                const groups = new Map<boolean, number>();

                players.forEach(player => {

                    const isActive = player.lastSeasonPlayed === this._currentYear;
                    this.trackGroups(groups, isActive);
                });

                return of(this.toGroupValues(groups, players.size));
            })
        );
    }

    public groupByEarnings(year: number): Observable<IGroupValue<number>[]> {

        const since = Math.max(this.configuration.startYear, year);

        return this.rankingLookup.getRankingsSince(since).pipe(

            switchMap(() => this.getPlayers(year)),
            switchMap(players => this.getEarnings(players)),
            switchMap(earnings => {

                const groups = new Map<number, number>();

                earnings.forEach(earning => {

                    this.trackGroups(groups, this.roundBy(earning, this._earningStep));
                });

                return of(this.toGroupValues(groups, earnings.length));
            })
        );
    }
}
