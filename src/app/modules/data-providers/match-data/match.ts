import { IMatch } from './match.interface';

export class Match implements IMatch {

    constructor(

        readonly matchId: number,
        readonly eventId: number,
        readonly worldSnookerId: number,
        readonly startDate: string,
        readonly endDate: string,
        readonly scheduledDate: string,
        readonly round: number,
        readonly session: string,
        readonly tableNumber: number,
        readonly frameScores: string,
        readonly player1: number,
        readonly score1: number,
        readonly player2: number,
        readonly score2: number,
        readonly walkover: number,
        readonly winner: number,
        readonly ongoing: boolean,
        readonly onBreak: boolean,
        readonly liveUrl: string,
        readonly vodUrl: string,
        readonly detailsUrl: string

    ) { }
}

function getWalkover(record: object): number {

    if (!record['Walkover1'] && !record['Walkover2']) {

        return null;
    }

    return record['Walkover1'] ? record['Player1ID'] : record['Player2ID'];
}

export function recordToMatch(record: object): IMatch {

    return new Match(

        record['ID'],
        record['EventID'],
        record['WorldSnookerID'],
        record['StartDate'],
        record['EndDate'],
        record['ScheduledDate'],
        record['Round'],
        record['Sessions'],
        record['TableNo'],
        record['FrameScores'],
        record['Player1ID'],
        record['Score1'],
        record['Player2ID'],
        record['Score2'],
        getWalkover(record),
        record['WinnerID'],
        record['Unfinished'],
        record['OnBreak'],
        record['LiveUrl'],
        record['VideoURL'],
        record['DetailsUrl']
    );
}
