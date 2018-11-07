import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { IPlayer } from './player.interface';
import { PlayerDataFixerService } from './player-data-fixer.service';
import { LivePlayerFetcherService } from './live-player-fetcher.service';
import { attachCorsProxy } from '../../../app-config';

@Injectable({
    providedIn: 'root'
})
export class CustomLivePlayerFetcherService extends LivePlayerFetcherService {

    private _apiUrl = 'https://snooker-data-api.herokuapp.com/api/players';

    constructor(

        httpClient: HttpClient,
        fixer: PlayerDataFixerService

    ) {

        super(httpClient, fixer);
    }

    public fetchById(id: number): Observable<IPlayer> {

        const url = attachCorsProxy(`${this._apiUrl}/${id}`);

        return this.httpClient.get<object>(url).pipe(

            retry(2),
            map(record => this.toPlayer(record)),
            catchError(() => of(null))
        );
    }

    private filterByYear(records: object[], year: number): object[] {

        return records.filter(record => record['activeYears'].includes(year));
    }

    public fetchByYear(year: number): Observable<IPlayer[]> {

        const url = attachCorsProxy(this._apiUrl);

        return this.httpClient.get<object>(url).pipe(

            retry(2),
            map(records => this.filterByYear(<object[]>records, year)),
            map(records => this.toPlayers(<object[]>records)),
            catchError(() => of(null))
        );
    }

    public fetchAll(): Observable<IPlayer[]> {

        const url = attachCorsProxy(this._apiUrl);

        return this.httpClient.get<object>(url).pipe(

            retry(2),
            map(records => this.toPlayers(<object[]>records)),
            catchError(() => of(null))
        );
    }
}
