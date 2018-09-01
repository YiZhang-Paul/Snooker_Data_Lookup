import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
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

    public getShortSummary(match: IMatch, priorityId: number): Observable<string> {

        return forkJoin(

            this.lookup.getPlayer(match.player1),
            this.lookup.getPlayer(match.player2)

        ).pipe(

            map(players => {

                const name1 = players[0] ? players[0].shortFullName : 'N/A';
                const name2 = players[1] ? players[1].shortFullName : 'N/A';
                const status = !this.isFinished(match) ? ' (TBA)' : '';

                return priorityId === match.player2 ?
                    `${name2} ${match.score2} - ${match.score1} ${name1}${status}` :
                    `${name1} ${match.score1} - ${match.score2} ${name2}${status}`;
            })
        );
    }
}
