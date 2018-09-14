import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPlayer } from '../players-data/player.interface';
import { IMatch } from './match.interface';
import { PlayerLookupService } from '../players-data/player-lookup.service';

@Injectable({
    providedIn: 'root'
})
export class MatchSummaryService {

    constructor(private lookup: PlayerLookupService) { }

    private isFinished(match: IMatch): boolean {

        return match.winner !== 0 || match.walkover !== null;
    }

    public getShortSummaryArray(

        match: IMatch, priorityId: number

    ): Observable<[IPlayer, IPlayer, string, boolean]> {

        return forkJoin(

            this.lookup.getPlayer(match.player1),
            this.lookup.getPlayer(match.player2)

        ).pipe(

            map(players => {

                const reverse = priorityId === match.player2;
                const score1 = reverse ? match.score2 : match.score1;
                const score2 = reverse ? match.score1 : match.score2;

                return <[IPlayer, IPlayer, string, boolean]>[

                    reverse ? players[1] : players[0],
                    reverse ? players[0] : players[1],
                    `${score1} - ${score2}`,
                    this.isFinished(match)
                ];
            })
        );
    }

    public getShortSummaryText(match: IMatch, priorityId: number): Observable<string> {

        return this.getShortSummaryArray(match, priorityId).pipe(

            map(summary => {

                const name1 = summary[0] ? summary[0].shortFullName : 'N/A';
                const name2 = summary[1] ? summary[1].shortFullName : 'N/A';
                const status = summary[3] ? '' : ' (TBA)';

                return `${name1} ${summary[2]} ${name2}${status}`;
            })
        );
    }
}
