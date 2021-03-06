import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { IMatch } from '../match-data/match.interface';
import { IMatchHistory } from './match-history.interface';
import { MatchHistory } from './match-history';
import { MatchLookupService } from '../match-data/match-lookup.service';
import { EventLookupService } from '../event-data/event-lookup.service';

@Injectable({
    providedIn: 'root'
})
export class PlayerMatchHistoryLookupService {

    constructor(

        private matchLookup: MatchLookupService,
        private eventLookup: EventLookupService

    ) { }

    private groupByEvent(matches: IMatch[]): Map<number, IMatch[]> {

        const groups = new Map<number, IMatch[]>();

        matches.forEach(match => {

            if (!groups.has(match.eventId)) {

                groups.set(match.eventId, new Array<IMatch>());
            }

            groups.get(match.eventId).push(match);
        });

        return groups;
    }

    private toHistory(eventId: number, matches: IMatch[]): Observable<IMatchHistory> {

        return this.eventLookup.getEvent(eventId).pipe(

            map(event => new MatchHistory(event, matches))
        );
    }

    private toHistories(groups: Map<number, IMatch[]>): Observable<IMatchHistory[]> {

        const histories: Observable<IMatchHistory>[] = [];

        groups.forEach((matches, eventId) => {

            histories.push(this.toHistory(eventId, matches));
        });

        return forkJoin(histories);
    }

    public getMatchHistories(id: number, year: number): Observable<IMatchHistory[]> {

        return this.matchLookup.getMatchesOfPlayer(id, year).pipe(

            map(matches => {

                if (matches.length === 0) {

                    throw new Error('no history found.');
                }

                return this.groupByEvent(matches);
            }),
            mergeMap(groups => this.toHistories(groups)),
            map(histories => histories.filter(history => history.event)),
            catchError(() => of(new Array<IMatchHistory>()))
        );
    }
}
