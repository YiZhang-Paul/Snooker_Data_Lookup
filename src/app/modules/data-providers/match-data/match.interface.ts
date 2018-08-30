export interface IMatch {

    readonly matchId: number;
    readonly eventId: number;
    readonly worldSnookerId: number;
    readonly startDate: string;
    readonly endDate: string;
    readonly scheduledDate: string;
    readonly round: number;
    readonly session: string;
    readonly tableNumber: number;
    readonly frameScores: string;
    readonly player1: number;
    readonly score1: number;
    readonly player2: number;
    readonly score2: number;
    readonly walkover: number;
    readonly winner: number;
    readonly ongoing: boolean;
    readonly onBreak: boolean;
    readonly liveUrl: string;
    readonly vodUrl: string;
    readonly detailsUrl: string;
}
