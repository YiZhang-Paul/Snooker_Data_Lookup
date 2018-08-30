import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ITournamentEvent } from './tournament-event.interface';
import { LiveEventFetcherService } from './live-event-fetcher.service';

@Injectable({
    providedIn: 'root'
})
export class EventLookupService {

    private _storageById = new Map<number, ITournamentEvent>();

    constructor(private fetcher: LiveEventFetcherService) { }

    private saveEvent(event: ITournamentEvent): void {

        if (event !== null) {

            this._storageById.set(event.eventId, event);
        }
    }

    public getEvent(id: number): Observable<ITournamentEvent> {

        if (this._storageById.has(id)) {

            return of(this._storageById.get(id));
        }

        return this.fetcher.fetchById(id).pipe(

            tap(event => this.saveEvent(event))
        );
    }
}
