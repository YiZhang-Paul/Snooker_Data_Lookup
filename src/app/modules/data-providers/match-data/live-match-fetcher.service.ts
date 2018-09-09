import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';
import { IMatch } from './match.interface';
import { recordToMatch } from './match';

@Injectable({
    providedIn: 'root'
})
export class LiveMatchFetcherService {

    constructor(private httpClient: HttpClient) { }

    protected toMatches(records: object[]): IMatch[] {

        const matches: IMatch[] = [];

        for (const record of records) {

            matches.push(recordToMatch(record));
        }

        return matches;
    }

    public fetchByPlayer(id: number, year: number): Observable<IMatch[]> {

        const url = `https://cors-anywhere.herokuapp.com/http://api.snooker.org/?t=8&p=${id}&s=${year}`;

        return this.httpClient.get<object>(url).pipe(

            retry(2),
            map(records => this.toMatches(<object[]>records)),
            catchError(() => of(null))
        );
    }
}
