import { Component, OnInit, Input } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { IMatchHistory } from '../../../data-providers/players-data/match-history.interface';
import { IMatch } from '../../../data-providers/match-data/match.interface';
import { PlayerLookupService } from '../../../data-providers/players-data/player-lookup.service';

@Component({
    selector: 'app-match-history-listing',
    templateUrl: './match-history-listing.component.html',
    styleUrls: ['./match-history-listing.component.css']
})
export class MatchHistoryListingComponent implements OnInit {

    @Input() history: IMatchHistory;
    private _matches$: Observable<string[]>;

    constructor(private lookup: PlayerLookupService) { }

    get matches$(): Observable<string[]> {

        return this._matches$;
    }

    ngOnInit() {

        this.loadMatchSummaries();
    }

    private getMatchSummary(match: IMatch): Observable<string> {

        const player1 = this.lookup.getPlayer(match.player1);
        const player2 = this.lookup.getPlayer(match.player2);

        return forkJoin(player1, player2).pipe(

            map(players => {

                const name1 = players[0] === null ?
                    'N/A' : `${players[0].firstName} ${players[0].lastName}`;

                const name2 = players[1] === null ?
                    'N/A' : `${players[1].firstName} ${players[1].lastName}`;

                return `${name1} ${match.score1} - ${match.score2} ${name2}`;
            })
        );
    }

    private loadMatchSummaries(): void {

        const summaries: Observable<string>[] = [];

        this.history.matches.forEach(match => {

            summaries.push(this.getMatchSummary(match));
        });

        this._matches$ = forkJoin(summaries);
    }
}
