import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { IMatch } from './match.interface';
import { IMatchShortSummary } from './match-short-summary.interface';
import { PlayerLookupService } from '../players-data/player-lookup.service';

@Injectable({
    providedIn: 'root'
})
export class MatchSummaryService {

    constructor(private lookup: PlayerLookupService) { }

    private isFinished(match: IMatch): boolean {

        return match.winner !== 0 || match.walkover !== null;
    }

    public getShortSummary(

        match: IMatch, priorityId: number

    ): Observable<IMatchShortSummary> {

        return forkJoin(

            this.lookup.getPlayer(match.player1),
            this.lookup.getPlayer(match.player2)

        ).pipe(

            map(players => {

                const reverse = priorityId === match.player2;
                const score1 = reverse ? match.score2 : match.score1;
                const score2 = reverse ? match.score1 : match.score2;

                return <IMatchShortSummary>{

                    player1: reverse ? players[1] : players[0],
                    player2: reverse ? players[0] : players[1],
                    score: `${score1} - ${score2}`,
                    finished: this.isFinished(match)
                };
            })
        );
    }

    public getShortSummaryText(match: IMatch, priorityId: number): Observable<string> {

        return this.getShortSummary(match, priorityId).pipe(

            map(summary => {

                const name1 = summary.player1 ? summary.player1.shortFullName : 'N/A';
                const name2 = summary.player2 ? summary.player2.shortFullName : 'N/A';
                const status = summary.finished ? '' : ' (TBA)';

                return `${name1} ${summary.score} ${name2}${status}`;
            })
        );
    }
}
