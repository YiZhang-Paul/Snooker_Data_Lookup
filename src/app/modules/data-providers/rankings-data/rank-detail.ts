import { IPlayer } from '../players-data/player.interface';
import { IRankDetail } from './rank-detail.interface';

export class RankDetail implements IRankDetail {

    constructor(

        readonly rank: number,
        readonly name: string,
        readonly nationality: string,
        readonly earnings: number,
        readonly player: IPlayer

    ) { }
}
