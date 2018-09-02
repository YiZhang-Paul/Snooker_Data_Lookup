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

    const rawData = [

        {
            // * without walkover
            ID: 3420410,
            Player1ID: 1,
            Score1: 4,
            Walkover1: false,
            Player2ID: 6,
            Score2: 1,
            Walkover2: false
        },
        {
            // * player 1 walkover
            ID: 0,
            Player1ID: 1,
            Score1: 0,
            Walkover1: true,
            Player2ID: 6,
            Score2: 0,
            Walkover2: false
        }
    ];

    const response = <IMatch[]>[

        {
            matchId: 3420410,
            player1: 1,
            score1: 4,
            player2: 6,
            score2: 1,
            walkover: null
        },
        {
            matchId: 0,
            player1: 1,
            score1: 0,
            player2: 6,
            score2: 0,
            walkover: 1
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
