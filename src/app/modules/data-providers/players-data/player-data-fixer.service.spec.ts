import { TestBed, inject } from '@angular/core/testing';
import { IPlayer } from './player.interface';
import { PlayerDataFixerService } from './player-data-fixer.service';
import { PLAYER_CONFIG } from '../../../player-config';

describe('PlayerDataFixerService', () => {

    let fixer: PlayerDataFixerService;

    const config = {

        10: {

            firstName: 'Jimmy',
            lastName: 'Raynor',
            photo: 'some-photo',
            turnedPro: 2014,
            lastSeasonPlayed: 2017
        }
    };

    const playerOne = <IPlayer>{

        id: 10,
        // will be fixed
        firstName: 'John',
        lastName: 'Doe',
        photo: 'no-photo',
        turnedPro: 2013,
        lastSeasonPlayed: 2018,
        // will not be fixed
        website: 'no-website',
        twitter: 'no-twitter'
    };

    const playerTwo = <IPlayer>{

        id: 52,
        firstName: 'Jane',
        lastName: 'Doe',
        turnedPro: 2015,
        lastSeasonPlayed: 2017
    };

    beforeEach(() => {

        TestBed.configureTestingModule({

            providers: [

                PlayerDataFixerService,
                { provide: PLAYER_CONFIG, useValue: config }
            ]
        });

        fixer = TestBed.get(PlayerDataFixerService);
    });

    it('should be created', inject([PlayerDataFixerService], (service: PlayerDataFixerService) => {

        expect(service).toBeTruthy();
    }));

    it('fixes should override player properties', () => {

        const fixed = fixer.fix(playerOne);
        const expected = config[playerOne.id];

        expect(fixed.firstName).toEqual(expected.firstName);
        expect(fixed.lastName).toEqual(expected.lastName);
        expect(fixed.photo).toEqual(expected.photo);
        expect(fixed.turnedPro).toEqual(expected.turnedPro);
        expect(fixed.lastSeasonPlayed).toEqual(expected.lastSeasonPlayed);
    });

    it('unfixed properties should remain unchanged', () => {

        const fixed = fixer.fix(playerOne);

        expect(fixed.website).toEqual(playerOne.website);
        expect(fixed.twitter).toEqual(playerOne.twitter);
    });

    it('should ignore players without fixes', () => {

        expect(fixer.fix(playerTwo)).toEqual(playerTwo);
    });
});
