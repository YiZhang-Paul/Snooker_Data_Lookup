import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
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

        const url = `https://cors.io?http://api.snooker.org/?p=${id}`;

        return this.httpClient.get<object>(url).pipe(

            retry(2),
            map(record => recordToPlayer(record[0])),
            catchError(() => of(null))
        );
    }

    public fetchByYear(year: number): Observable<IPlayer[]> {

        const url = `https://cors.io?http://api.snooker.org/?t=10&st=p&s=${year}`;

        return this.httpClient.get<object>(url).pipe(

            retry(2),
            map(records => this.toPlayers(<object[]>records)),
            catchError(() => of(null))
        );
    }
}
