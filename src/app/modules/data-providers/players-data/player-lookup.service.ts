import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IPlayer } from './player.interface';
import { LivePlayerFetcherService } from './live-player-fetcher.service';

@Injectable({
    providedIn: 'root'
})
export class PlayerLookupService {

    private _lookup = new Map<number, Map<number, IPlayer>>();

    constructor(private fetcher: LivePlayerFetcherService) { }

    private savePlayers(year: number, players: IPlayer[]): void {

        const map = new Map<number, IPlayer>();

        players.forEach(player => {

            map.set(player.id, player);
        });

        this._lookup.set(year, map);
    }

    private loadPlayers(year: number): Observable<IPlayer[]> {

        return this.fetcher.fetch(year).pipe(

            tap(players => {

                if (players !== null) {

                    this.savePlayers(year, players);
                }
            })
        );
    }

    private toList(map: Map<number, IPlayer>): IPlayer[] {

        const list: IPlayer[] = [];
        map.forEach(player => list.push(player));

        return list;
    }

    public getPlayers(year: number): Observable<IPlayer[]> {

        if (this._lookup.has(year)) {

            const players = this._lookup.get(year);

            return of(this.toList(players));
        }

        return this.loadPlayers(year);
    }

    public getPlayer(year: number, id: number): Observable<IPlayer> {

        return null;
    }
}
