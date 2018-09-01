import { Component, OnInit, Input } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { IMatchHistory } from '../../../data-providers/players-data/match-history.interface';
import { MatchSummaryService } from '../../../data-providers/match-data/match-summary.service';

@Component({
    selector: 'app-match-history-listing',
    templateUrl: './match-history-listing.component.html',
    styleUrls: ['./match-history-listing.component.css']
})
export class MatchHistoryListingComponent implements OnInit {

    @Input() id: number;
    @Input() history: IMatchHistory;
    private _matches$: Observable<string[]>;

    constructor(private summary: MatchSummaryService) { }

    get matches$(): Observable<string[]> {

        return this._matches$;
    }

    ngOnInit() {

        this.loadMatchSummaries();
    }

    private loadMatchSummaries(): void {

        const summaries: Observable<string>[] = [];

        this.history.matches.forEach(match => {

            summaries.push(this.summary.getShortSummary(match, this.id));
        });

        this._matches$ = forkJoin(summaries);
    }
}
