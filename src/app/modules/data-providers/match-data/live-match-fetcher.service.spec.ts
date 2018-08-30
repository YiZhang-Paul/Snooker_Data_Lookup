import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IMatch } from './match.interface';
import { LiveMatchFetcherService } from './live-match-fetcher.service';

describe('LiveMatchFetcherService', () => {

    let httpTestingController: HttpTestingController;
    let fetcher: LiveMatchFetcherService;
    const id = 203;
    const year = 2016;
    const urlByPlayer = `http://api.snooker.org/?t=8&p=${id}&s=${year}`;

    const rawData: object[] = [

        {
            // without walkover
            ID: 3420410,
            EventID: 397,
            Round: 7,
            Player1ID: 1,
            Score1: 4,
            Walkover1: false,
            Player2ID: 6,
            Score2: 1,
            Walkover2: false,
            WinnerID: 1,
            Unfinished: false,
            OnBreak: false,
            WorldSnookerID: 386770,
            LiveUrl: '',
            DetailsUrl: '',
            TableNo: 0,
            VideoURL: '',
            StartDate: '2015-08-01T09:39:59Z',
            EndDate: '2015-08-01T12:34:24Z',
            ScheduledDate: '2015-08-01T09:30:00Z',
            FrameScores: '',
            Sessions: ''
        },
        {
            ID: 0, EventID: 0, Round: 0, Score1: 0, Score2: 0, Sessions: '',
            Unfinished: false, OnBreak: false, WorldSnookerID: 0,
            LiveUrl: '', DetailsUrl: '', TableNo: 0, VideoURL: '',
            StartDate: '', EndDate: '', ScheduledDate: '', FrameScores: '',
            // player 1 walkover
            Player1ID: 1,
            Walkover1: true,
            Player2ID: 6,
            Walkover2: false,
            WinnerID: 1
        }
    ];

    const response: IMatch[] = [

        {
            matchId: 3420410,
            eventId: 397,
            worldSnookerId: 386770,
            startDate: '2015-08-01T09:39:59Z',
            endDate: '2015-08-01T12:34:24Z',
            scheduledDate: '2015-08-01T09:30:00Z',
            round: 7,
            session: '',
            tableNumber: 0,
            frameScores: '',
            player1: 1,
            score1: 4,
            player2: 6,
            score2: 1,
            walkover: null,
            winner: 1,
            ongoing: false,
            onBreak: false,
            liveUrl: '',
            vodUrl: '',
            detailsUrl: ''
        },
        {
            matchId: 0,
            eventId: 0,
            worldSnookerId: 0,
            startDate: '',
            endDate: '',
            scheduledDate: '',
            round: 0,
            session: '',
            tableNumber: 0,
            frameScores: '',
            player1: 1,
            score1: 0,
            player2: 6,
            score2: 0,
            walkover: 1,
            winner: 1,
            ongoing: false,
            onBreak: false,
            liveUrl: '',
            vodUrl: '',
            detailsUrl: ''
        }
    ];

    beforeEach(() => {

        TestBed.configureTestingModule({

            imports: [HttpClientTestingModule],
            providers: [LiveMatchFetcherService]
        });

        httpTestingController = TestBed.get(HttpTestingController);
        fetcher = TestBed.get(LiveMatchFetcherService);
    });

    afterEach(() => {

        httpTestingController.verify();
    });

    it('should be created', inject([LiveMatchFetcherService], (service: LiveMatchFetcherService) => {

        expect(service).toBeTruthy();
    }));

    it('fetchByPlayer() should return match data response on success', () => {

        fetcher.fetchByPlayer(id, year).subscribe(data => {

            expect(JSON.stringify(data)).toEqual(JSON.stringify(response));
        });

        httpTestingController.expectOne(urlByPlayer).flush(rawData);
    });

    it('fetchByPlayer() should retry 2 times before returning null on failure', () => {

        fetcher.fetchByPlayer(id, year).subscribe(data => {

            expect(data).toBeNull();
        });

        for (let retries = 2, i = 0; i < retries + 1; i++) {

            httpTestingController.expectOne(urlByPlayer).error(null);
        }
    });
});
