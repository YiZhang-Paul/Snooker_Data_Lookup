import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { IPlayer } from './player.interface';
import { LivePlayerFetcherService } from './live-player-fetcher.service';

@Injectable({
    providedIn: 'root'
})
export class PlayerLookupService {

    private _storageById = new Map<number, IPlayer>();
    private _storageByYear = new Map<number, Map<number, IPlayer>>();
    private _players$ = new BehaviorSubject(new Map<number, IPlayer>());

    constructor(private fetcher: LivePlayerFetcherService) { }

    get players$(): BehaviorSubject<Map<number, IPlayer>> {

        return this._players$;
    }

    private toMap(players: IPlayer[]): Map<number, IPlayer> {

        const result = new Map<number, IPlayer>();

        players.forEach(player => {

            result.set(player.id, player);
        });

        return result;
    }

    private savePlayer(player: IPlayer): void {

        if (player !== null && !this._storageById.has(player.id)) {

            this._storageById.set(player.id, player);
        }
    }

    private savePlayers(year: number, players: IPlayer[]): void {

        if (players !== null) {

            this._storageByYear.set(year, this.toMap(players));

            players.forEach(player => {

                this.savePlayer(player);
            });
        }
    }

    public getPlayer(id: number): Observable<IPlayer> {

        if (this._storageById.has(id)) {

            return of(this._storageById.get(id));
        }

        return this.fetcher.fetchById(id).pipe(

            tap(player => {

                this.savePlayer(player);
                this.players$.next(this._storageById);
            })
        );
    }

    public getPlayers(year: number): Observable<Map<number, IPlayer>> {

        if (this._storageByYear.has(year)) {

            return of(this._storageByYear.get(year));
        }

        return this.fetcher.fetchByYear(year).pipe(

            tap(players => {

                this.savePlayers(year, players);
                this.players$.next(this._storageById);
            }),
            map(players => players !== null ? this.toMap(players) : null)
        );
    }
}
