import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';
import { ITournamentEvent } from './tournament-event.interface';
import { recordToTournamentEvent } from './tournament-event';
import { attachCorsProxy } from '../../../app-config';

@Injectable({
    providedIn: 'root'
})
export class LiveEventFetcherService {

    constructor(private httpClient: HttpClient) { }

    public fetchById(id: number): Observable<ITournamentEvent> {

        const url = attachCorsProxy(`http://api.snooker.org/?e=${id}`);

        return this.httpClient.get<object>(url).pipe(

            retry(2),
            map(record => recordToTournamentEvent(record[0])),
            catchError(() => of(null))
        );
    }
}
