import { IPlayer } from '../players-data/player.interface';

export interface IMatchShortSummary {

    readonly player1: IPlayer;
    readonly player2: IPlayer;
    readonly score: string;
    readonly finished: boolean;
}
