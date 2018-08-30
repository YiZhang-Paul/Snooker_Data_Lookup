import { ITournamentEvent } from './tournament-event.interface';

export class TournamentEvent implements ITournamentEvent {

    constructor(

        readonly eventId: number,
        readonly previousEventId: number,
        readonly mainEventId: number,
        readonly worldSnookerId: number,
        readonly name: string,
        readonly stage: string,
        readonly type: string,
        readonly participants: number,
        readonly defendingChampion: number,
        readonly season: number,
        readonly sponsor: string,
        readonly startDate: string,
        readonly endDate: string,
        readonly stops: number,
        readonly venue: string,
        readonly city: string,
        readonly country: string,
        readonly sex: string,
        readonly ageGroup: string,
        readonly url: string,
        readonly twitter: string,
        readonly photos: string,
        readonly hashTag: string,
        readonly related: string

    ) { }
}

export function recordToTournamentEvent(record: object): ITournamentEvent {

    return new TournamentEvent(

        record['ID'],
        record['PreviousEdition'],
        record['Main'],
        record['WorldSnookerId'],
        record['Name'],
        record['Stage'],
        record['Type'],
        record['NumCompetitors'],
        record['DefendingChampion'],
        record['Season'],
        record['Sponsor'],
        record['StartDate'],
        record['EndDate'],
        record['Num'],
        record['Venue'],
        record['City'],
        record['Country'],
        record['Sex'],
        record['AgeGroup'],
        record['Url'],
        record['Twitter'],
        record['PhotoURLs'],
        record['HashTag'],
        record['Related']
    );
}
