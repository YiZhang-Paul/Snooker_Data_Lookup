import { IPlayer } from '../players-data/player.interface';

export interface IRankDetail {

    readonly rank: number;
    readonly name: string;
    readonly nationality: string;
    readonly earnings: number;
    readonly player: IPlayer;
}
