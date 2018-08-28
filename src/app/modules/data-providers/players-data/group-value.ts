import { IGroupValue } from './group-value.interface';

export class GroupValue<T> implements IGroupValue<T> {

    constructor(

        readonly key: T,
        readonly size: number,
        readonly percentage: number

    ) { }
}
