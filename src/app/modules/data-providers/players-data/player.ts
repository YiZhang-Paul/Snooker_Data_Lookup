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

    get shortFullName(): string {

        return `${this.firstName} ${this.lastName}`;
    }

    get fullName(): string {

        const middleName = this.middleName ? ` ${this.middleName} ` : ' ';

        return `${this.firstName}${middleName}${this.lastName}`;
    }
}

export function recordToPlayer(record: object): IPlayer {

    const lastSeason = record['LastSeasonAsPro'];

    return new Player(

        record['ID'],
        record['FirstName'],
        record['MiddleName'],
        record['LastName'],
        record['ShortName'],
        record['Born'],
        record['Sex'],
        record['Nationality'],
        record['Photo'],
        record['BioPage'],
        record['URL'],
        record['Twitter'],
        record['FirstSeasonAsPro'],
        lastSeason ? lastSeason : new Date().getFullYear()
    );
}
