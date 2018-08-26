import { TestBed, inject } from '@angular/core/testing';
import { IPlayer } from '../../data-providers/players-data/player.interface';
import { PlayerFilterService } from './player-filter.service';

describe('PlayerFilterService', () => {

    const players: IPlayer[] = [

        {
            id: 293,
            firstName: 'John',
            middleName: 'K',
            lastName: 'Doe',
            shortName: 'John Doe',
            dateOfBirth: '1999-12-12',
            sex: 'M',
            nationality: 'three-body',
            photo: 'photo.jpg',
            bioPage: 'bio.com',
            website: 'site.com',
            twitter: '@kDoe',
            turnedPro: 2013,
            lastSeasonPlayed: 2018
        },
        {
            id: 130,
            firstName: 'Jane',
            middleName: '',
            lastName: 'Doe',
            shortName: 'Jane Doe',
            dateOfBirth: '1993-04-17',
            sex: 'F',
            nationality: 'three-body',
            photo: 'photo.jpg',
            bioPage: 'bio.com',
            website: 'site.com',
            twitter: '@NDoe',
            turnedPro: 2012,
            lastSeasonPlayed: 2018
        },
        {
            id: 15,
            firstName: 'Jim',
            middleName: '',
            lastName: 'Moe',
            shortName: 'Jim Moe',
            dateOfBirth: '1985-08-25',
            sex: 'M',
            nationality: 'china',
            photo: 'photo.jpg',
            bioPage: 'bio.com',
            website: 'site.com',
            twitter: '@Moe',
            turnedPro: 2009,
            lastSeasonPlayed: 2018
        }
    ];

    let filter: PlayerFilterService;

    beforeEach(() => {

        TestBed.configureTestingModule({

            providers: [PlayerFilterService]
        });

        filter = TestBed.get(PlayerFilterService);
    });

    it('should be created', inject([PlayerFilterService], (service: PlayerFilterService) => {

        expect(service).toBeTruthy();
    }));

    it('should not filter players when nationality filter is empty', () => {

        expect(filter.filterByNationality(players, '')).toEqual(players);
    });

    it('should filter players with nationality filter', () => {

        expect(filter.filterByNationality(players, 'china')).toEqual(players.slice(2));
        expect(filter.filterByNationality(players, 'three-body')).toEqual(players.slice(0, 2));
    });

    it('should not filter players when name filter is empty', () => {

        expect(filter.filterByName(players, '')).toEqual(players);
    });

    it('should filter players with name filter', () => {

        expect(filter.filterByName(players, 'jim')).toEqual(players.slice(2));
        // 'no' matches 'n' and 'o' in names 'Joh(n) D(o)e' and 'Ja(n)e D(o)e'
        expect(filter.filterByName(players, 'no')).toEqual(players.slice(0, 2));
    });
});
