import { ITournamentEvent } from '../event-data/tournament-event.interface';
import { IMatch } from '../match-data/match.interface';

export interface IMatchHistory {

    readonly event: ITournamentEvent;
    readonly matches: IMatch[];
}
