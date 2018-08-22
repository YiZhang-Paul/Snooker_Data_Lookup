import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { IPlayer } from './player.interface';
import { LivePlayerFetcherService } from './live-player-fetcher.service';

@Injectable({
    providedIn: 'root'
})
export class PlayerLookupService {

    private _storage = new Map<number, Map<number, IPlayer>>();

    constructor(private fetcher: LivePlayerFetcherService) { }

    private toMap(players: IPlayer[]): Map<number, IPlayer> {

        const map = new Map<number, IPlayer>();

        players.forEach(player => {

            map.set(player.id, player);
        });

        return map;
    }

    private savePlayers(year: number, players: IPlayer[]): void {

        if (players !== null) {

            this._storage.set(year, this.toMap(players));
        }
    }

    public getPlayers(year: number): Observable<Map<number, IPlayer>> {

        if (this._storage.has(year)) {

            return of(this._storage.get(year));
        }

        return this.fetcher.fetch(year).pipe(

            tap(players => {

                this.savePlayers(year, players);
            }),
            switchMap(players => {

                return of(players !== null ? this.toMap(players) : null);
            })
        );
    }

    public getPlayer(year: number, id: number): Observable<IPlayer> {

        if (this._storage.has(year)) {

            const players = this._storage.get(year);

            return of(players.has(id) ? players.get(id) : null);
        }

        return this.getPlayers(year).pipe(

            switchMap(players => {

                if (players === null) {

                    return of(null);
                }

                return of(players.has(id) ? players.get(id) : null);
            })
        );
    }
}
