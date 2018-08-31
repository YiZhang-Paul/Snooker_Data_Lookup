import { ITournamentEvent } from '../event-data/tournament-event.interface';
import { IMatch } from '../match-data/match.interface';
import { IMatchHistory } from './match-history.interface';

export class MatchHistory implements IMatchHistory {

    constructor(

        readonly event: ITournamentEvent,
        readonly matches: IMatch[]

    ) { }
}
