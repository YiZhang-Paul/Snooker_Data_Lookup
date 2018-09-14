import { Component, OnInit, Input } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { IPlayer } from '../../../data-providers/players-data/player.interface';
import { IMatchHistory } from '../../../data-providers/players-data/match-history.interface';
import { MatchSummaryService } from '../../../data-providers/match-data/match-summary.service';
import { CountryFlagLookupService } from '../../../../shared/services/country-flag-lookup.service';

@Component({
    selector: 'app-match-history-listing',
    templateUrl: './match-history-listing.component.html',
    styleUrls: ['./match-history-listing.component.css']
})
export class MatchHistoryListingComponent implements OnInit {

    @Input() id: number;
    @Input() history: IMatchHistory;
    private _flags: Map<string, string> = null;
    private _matches$: Observable<[IPlayer, IPlayer, string, boolean][]>;

    constructor(

        private summary: MatchSummaryService,
        private flagLookup: CountryFlagLookupService

    ) { }

    get eventLocation(): string {

        const event = this.history.event;

        return `${event.city}, ${event.country}`;
    }

    get eventStart(): string {

        return this.toLocaleDate(this.history.event.startDate);
    }

    get eventEnd(): string {

        return this.toLocaleDate(this.history.event.endDate);
    }

    get flags(): Map<string, string> {

        return this._flags;
    }

    get matches$(): Observable<[IPlayer, IPlayer, string, boolean][]> {

        return this._matches$;
    }

    ngOnInit() {

        this.loadMatchSummaries();

        this.flagLookup.getFlags().subscribe(flags => {

            this._flags = flags;
        });
    }

    private toLocaleDate(date: string): string {

        return new Date(date).toLocaleDateString();
    }

    private loadMatchSummaries(): void {

        const summaries: Observable<[IPlayer, IPlayer, string, boolean]>[] = [];

        this.history.matches.forEach(match => {

            summaries.push(this.summary.getShortSummaryArray(match, this.id));
        });

        this._matches$ = forkJoin(summaries);
    }
}
