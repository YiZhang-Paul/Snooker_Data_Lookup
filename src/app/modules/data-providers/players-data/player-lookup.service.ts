import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { IPlayer } from './player.interface';
import { LivePlayerFetcherService } from './live-player-fetcher.service';

@Injectable({
    providedIn: 'root'
})
export class PlayerLookupService {

    private _storageById = new Map<number, IPlayer>();
    private _storageByYear = new Map<number, Map<number, IPlayer>>();

    constructor(private fetcher: LivePlayerFetcherService) { }

    private toMap(players: IPlayer[]): Map<number, IPlayer> {

        const map = new Map<number, IPlayer>();

        players.forEach(player => {

            map.set(player.id, player);
        });

        return map;
    }

    private savePlayer(player: IPlayer): void {

        if (player !== null && !this._storageById.has(player.id)) {

            this._storageById.set(player.id, player);
        }
    }

    private savePlayers(year: number, players: IPlayer[]): void {

        if (players !== null) {

            this._storageByYear.set(year, this.toMap(players));
        }
    }

    public getPlayer(id: number): Observable<IPlayer> {

        if (this._storageById.has(id)) {

            return of(this._storageById.get(id));
        }

        return this.fetcher.fetchById(id).pipe(

            tap(player => {

                this.savePlayer(player);
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
            }),
            switchMap(players => {

                return of(players !== null ? this.toMap(players) : null);
            })
        );
    }
}
