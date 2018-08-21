import { IPlayer } from './player.interface';

export class Player implements IPlayer {

    constructor(

        readonly id: number,
        readonly firstName: string,
        readonly middleName: string,
        readonly lastName: string,
        readonly shortName: string,
        readonly dateOfBirth: string,
        readonly sex: string,
        readonly nationality: string,
        readonly photo: string,
        readonly bioPage: string,
        readonly website: string,
        readonly twitter: string,
        readonly turnedPro: number,
        readonly lastSeasonPlayed: number

    ) { }
}
