import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IMatch } from './match.interface';
import { LiveMatchFetcherService } from './live-match-fetcher.service';

@Injectable({
    providedIn: 'root'
})
export class MatchLookupService {

    private _storageByPlayer = new Map<number, Map<number, IMatch[]>>();

    constructor(private fetcher: LiveMatchFetcherService) { }

    private hasMatchesOfPlayer(playerId: number, year: number): boolean {

        if (!this._storageByPlayer.has(playerId)) {

            return false;
        }

        return this._storageByPlayer.get(playerId).has(year);
    }

    private saveMatches(playerId: number, year: number, matches: IMatch[]): void {

        if (matches === null) {

            return;
        }

        if (!this._storageByPlayer.has(playerId)) {

            this._storageByPlayer.set(playerId, new Map<number, IMatch[]>());
        }

        this._storageByPlayer.get(playerId).set(year, matches);
    }

    public getMatchesOfPlayer(playerId: number, year: number): Observable<IMatch[]> {

        if (this.hasMatchesOfPlayer(playerId, year)) {

            return of(this._storageByPlayer.get(playerId).get(year));
        }

        return this.fetcher.fetchByPlayer(playerId, year).pipe(

            tap(matches => this.saveMatches(playerId, year, matches))
        );
    }
}
