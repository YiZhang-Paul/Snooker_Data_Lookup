import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { IPlayer } from './player.interface';
import { recordToPlayer } from './player';

@Injectable({
    providedIn: 'root'
})
export class LivePlayerFetcherService {

    constructor(private httpClient: HttpClient) { }

    protected toPlayers(records: object[]): IPlayer[] {

        const players: IPlayer[] = [];

        for (const record of records) {

            players.push(recordToPlayer(record));
        }

        return players;
    }

    public fetchById(id: number): Observable<IPlayer> {

        const url = `http://api.snooker.org/?p=${id}`;

        return this.httpClient.get<object>(url).pipe(

            retry(2),
            switchMap(record => of(recordToPlayer(record))),
            catchError(() => of(null))
        );
    }

    public fetchByYear(year: number): Observable<IPlayer[]> {

        const url = `http://api.snooker.org/?t=10&st=p&s=${year}`;

        return this.httpClient.get<object>(url).pipe(

            retry(2),
            switchMap(records => of(this.toPlayers(<object[]>records))),
            catchError(() => of(null))
        );
    }
}
