export interface ITournamentEvent {

    readonly eventId: number;
    readonly previousEventId: number;
    readonly mainEventId: number;
    readonly worldSnookerId: number;
    readonly name: string;
    readonly stage: string;
    readonly type: string;
    readonly participants: number;
    readonly defendingChampion: number;
    readonly season: number;
    readonly sponsor: string;
    readonly startDate: string;
    readonly endDate: string;
    readonly stops: number;
    readonly venue: string;
    readonly city: string;
    readonly country: string;
    readonly sex: string;
    readonly ageGroup: string;
    readonly url: string;
    readonly twitter: string;
    readonly photos: string;
    readonly hashTag: string;
    readonly related: string;
}
