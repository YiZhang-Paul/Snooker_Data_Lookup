import { IRankData } from './rank-data.interface';

export class RankData implements IRankData {

    constructor(

        public readonly position: number,
        public readonly playerId: number,
        public readonly earnings: number,
        public readonly type: string

    ) { }
}
