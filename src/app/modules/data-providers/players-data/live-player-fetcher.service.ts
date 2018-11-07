import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { IPlayer } from './player.interface';
import { PlayerDataFixerService } from './player-data-fixer.service';
import { recordToPlayer } from './player';
import { attachCorsProxy } from '../../../app-config';

@Injectable({
    providedIn: 'root'
})
export class LivePlayerFetcherService {

    constructor(

        protected httpClient: HttpClient,
        protected fixer: PlayerDataFixerService

    ) { }

    protected toPlayer(record: object): IPlayer {

        return this.fixer.fix(recordToPlayer(record));
    }

    protected toPlayers(records: object[]): IPlayer[] {

        const players: IPlayer[] = [];

        for (const record of records) {

            players.push(this.toPlayer(record));
        }

        return players;
    }

    public fetchById(id: number): Observable<IPlayer> {

        const url = attachCorsProxy(`http://api.snooker.org/?p=${id}`);

        return this.httpClient.get<object>(url).pipe(

            retry(2),
            map(record => this.toPlayer(record[0])),
            catchError(() => of(null))
        );
    }

    public fetchByYear(year: number): Observable<IPlayer[]> {

        const url = attachCorsProxy(`http://api.snooker.org/?t=10&st=p&s=${year}`);

        return this.httpClient.get<object>(url).pipe(

            retry(2),
            map(records => this.toPlayers(<object[]>records)),
            catchError(() => of(null))
        );
    }
}
