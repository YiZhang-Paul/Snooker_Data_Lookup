import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IPlayer } from './player.interface';
import { CustomLivePlayerFetcherService } from './custom-live-player-fetcher.service';

@Injectable({
    providedIn: 'root'
})
export class CustomPlayerLookupService {

    private _storageById: Map<number, IPlayer> = null;
    private _storageByYear = new Map<number, Map<number, IPlayer>>();
    private _players$ = new BehaviorSubject(new Map<number, IPlayer>());

    constructor(private fetcher: CustomLivePlayerFetcherService) {

        this.initialize();
    }

    private toMap(players: IPlayer[]): Map<number, IPlayer> {

        const playerMap = new Map<number, IPlayer>();

        players.forEach(player => {

            playerMap.set(player.id, player);
        });

        return playerMap;
    }

    private initialize(): void {

        this.fetcher.fetchAll().subscribe(players => {

            if (players !== null) {

                this._storageById = this.toMap(players);
                this._players$.next(this._storageById);
            }
        });
    }

    get players$(): BehaviorSubject<Map<number, IPlayer>> {

        return this._players$;
    }

    public getPlayer(id: number): Observable<IPlayer> {

        if (this._storageById && this._storageById.has(id)) {

            return of(this._storageById.get(id));
        }

        return this.fetcher.fetchById(id);
    }

    public getPlayers(year: number): Observable<Map<number, IPlayer>> {

        if (this._storageByYear && this._storageByYear.has(year)) {

            return of(this._storageByYear.get(year));
        }

        return this.fetcher.fetchByYear(year).pipe(

            map(players => players === null ? null : this.toMap(players)),
            tap(players => {

                if (players !== null) {

                    this._storageByYear.set(year, players);
                }
            })
        );
    }
}
