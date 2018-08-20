import { IRankItem } from './rank-item.interface';

export class RankItem implements IRankItem {

    constructor(

        public readonly position: number,
        public readonly playerId: number,
        public readonly earnings: number,
        public readonly type: string

    ) { }
}
